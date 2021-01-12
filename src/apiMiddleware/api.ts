/* eslint-disable import/no-cycle */
import { Middleware, Dispatch, MiddlewareAPI } from 'redux'

import * as APIActions from './action'

import { REST_API } from './constant'

import { buildRequest, emitStageFunction, getResponseBody } from './helper'

import { APIAction, Settings, StageAction, StartActionParams } from './type'

// eslint-disable-next-line import/prefer-default-export
export class APIMiddleware {
  headers?: Settings['headers']

  handleFailedRequest?: Settings['handleFailedRequest']

  constructor(settings?: Settings) {
    this.headers = settings?.headers
    this.handleFailedRequest = settings?.handleFailedRequest
  }

  public middleware = (): Middleware<Dispatch<APIAction>> => {
    return (api) => (next) => async (action: APIAction): Promise<APIAction | StageAction> => {
      if (action.type !== REST_API) {
        return next(action)
      }

      return this.request(action, api)
    }
  }

  private async request(action: APIAction, store: MiddlewareAPI): Promise<StageAction> {
    const abortController = new AbortController()

    const startActionParams = { action, abortController, store, api: this }

    try {
      emitStageFunction(startActionParams)

      if (action.stageActionTypes.START) {
        store.dispatch(APIActions.start(startActionParams))
      }

      const [request, response] = await this.fetch(startActionParams)

      const body = await getResponseBody(action, response)

      const endActionParams = { body, request, response, ...startActionParams }

      emitStageFunction(endActionParams)

      return store.dispatch(APIActions[response.ok ? 'success' : 'fail'](endActionParams))
    } catch (e) {
      const requestError = e.toString()

      const failActionParams = { requestError, ...startActionParams }

      emitStageFunction(failActionParams)

      return store.dispatch(APIActions.fail(failActionParams))
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async fetch(params: StartActionParams): Promise<[Request, Response]> {
    const request = buildRequest(params)

    let response = params.action.mockResponse

    if (!response) {
      response = await fetch(request.clone())
    }

    if (!response.ok && this.handleFailedRequest) {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const retryRequest = await this.handleFailedRequest({ request, response, ...params })

        if (!retryRequest) break
        // eslint-disable-next-line no-await-in-loop
        response = await fetch(retryRequest)
      }
    }

    return [request, response]
  }
}
