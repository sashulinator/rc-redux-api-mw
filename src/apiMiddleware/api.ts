/* eslint-disable import/no-cycle */
import { Middleware, Dispatch, MiddlewareAPI } from 'redux'

import * as APIActions from './action'

import { REST_API } from './constant'

import { buildRequest, emitStageFunction, getResponseBody } from './helper'

import { APIAction, Settings, StageAction, StartActionParams } from './type'

// eslint-disable-next-line import/prefer-default-export
export class APIMiddleware {
  headers?: Settings['headers']

  beforeFail?: Settings['beforeFail']

  onStart?: Settings['onStart']

  onFail?: Settings['onFail']

  onSuccess?: Settings['onSuccess']

  constructor(settings?: Settings) {
    this.headers = settings?.headers
    this.beforeFail = settings?.beforeFail
    this.onStart = settings?.onStart
    this.onFail = settings?.onFail
    this.onSuccess = settings?.onSuccess
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
      emitStageFunction('onStart', startActionParams)

      if (action.stageActionTypes.START) {
        store.dispatch(APIActions.start(startActionParams))
      }

      const [request, response] = await this.fetch(startActionParams)

      const body = await getResponseBody(action, response)

      const endActionParams = { body, request, response, ...startActionParams }

      emitStageFunction(response.ok ? 'onSuccess' : 'onFail', endActionParams)

      return store.dispatch(response.ok ? APIActions.success(endActionParams) : APIActions.fail(endActionParams))
    } catch (error) {
      const requestError = error.toString()

      const failActionParams = { requestError, ...startActionParams }

      emitStageFunction('onFail', failActionParams)

      store.dispatch(APIActions.fail(failActionParams))

      throw error
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async fetch(params: StartActionParams): Promise<[Request, Response]> {
    const request = buildRequest(params)

    let response = await fetch(request.clone())

    if (!response.ok && this.beforeFail) {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const retryRequest = await this.beforeFail({ request, response, ...params })

        if (!retryRequest) break
        // eslint-disable-next-line no-await-in-loop
        response = await fetch(retryRequest)
      }
    }

    return [request, response]
  }
}
