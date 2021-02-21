/* eslint-disable import/no-cycle */
import { Middleware, Dispatch, MiddlewareAPI } from 'redux'

import { REST_API } from './constant'

import { buildRequest, onStage, getResponseBody } from './helper'

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

      this.request(action, api)

      return action
    }
  }

  private async request(action: APIAction, store: MiddlewareAPI): Promise<void> {
    const abortController = new AbortController()

    const startActionParams = { action, abortController, store, config: this.config }

    try {
      const [request, response] = await this.fetch(startActionParams)

      onStage('onStart', startActionParams)

      const body = await getResponseBody(action, response)

      const endActionParams = { body, request, response, ...startActionParams }

      onStage(response.ok ? 'onSuccess' : 'onFail', endActionParams)
    } catch (error) {
      const failActionParams = { error, ...startActionParams }

      onStage('onFail', failActionParams)

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
