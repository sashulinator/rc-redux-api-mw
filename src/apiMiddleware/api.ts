/* eslint-disable import/no-cycle */
import { Middleware, Dispatch, MiddlewareAPI } from 'redux'

import * as APIActions from './action'

import { REST_API } from './constant'

import { buildRequest, emitStageFunction, getResponseBody } from './helper'

import { APIAction, Config, StageAction, StartActionParams } from './type'

class APIReduxMiddleware {
  config: Config

  constructor(config?: Config) {
    this.config = config || null
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

    const startActionParams = { action, abortController, store, config: this.config }

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

  private async fetch(params: StartActionParams): Promise<[Request, Response]> {
    const request = buildRequest(params)

    let response = await fetch(request.clone())

    if (!response.ok && this.config?.beforeFail) {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const retryRequest = await this.config.beforeFail({ request, response, ...params })

        if (!retryRequest) break
        // eslint-disable-next-line no-await-in-loop
        response = await fetch(retryRequest)
      }
    }

    return [request, response]
  }
}

export default APIReduxMiddleware
