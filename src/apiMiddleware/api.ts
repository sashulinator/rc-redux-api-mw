/* eslint-disable import/no-cycle */
import { Middleware, Dispatch, MiddlewareAPI } from 'redux'

import * as APIActions from './action'

import { REST_API } from './constant'

import { buildRequest, emitStageFunction, getResponseBody } from './helper'

import { APIAction, Settings, StageAction, StartActionParams } from './type'

// eslint-disable-next-line import/prefer-default-export
export class APIMiddleware {
  refreshAction?: Settings['refreshAction']

  headers?: Settings['headers']

  constructor(settings?: Settings) {
    this.refreshAction = settings?.refreshAction
    this.headers = settings?.headers
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

      store.dispatch(APIActions.start(startActionParams))

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

  // private async refreshToken(
  //   api: MiddlewareAPI,
  //   refreshAction: APIAction
  // ): Promise<boolean> {
  //   const result = await api.dispatch(refreshAction);

  //   // TODO it must be client function
  //   if (result?.payload?.body?.token && result?.payload?.body?.refreshToken) {
  //     localStorage.setItem("token", result?.payload?.body?.token);
  //     localStorage.setItem("refreshToken", result?.payload?.body?.refreshToken);

  //     return true;
  //   }

  //   // TODO client must do smth if failed
  //   return false;
  // }

  // eslint-disable-next-line class-methods-use-this
  private async fetch(params: StartActionParams): Promise<[Request, Response]> {
    const request = buildRequest(params)

    const response = await fetch(request)

    // if (!response.ok) {
    //   const retryRequest = await handleFailedRequest(api, refreshAction);

    //   if (isSuccess) {
    //     response = await fetch(retryRequest);
    //   }
    // }

    return [request, response]
  }
}
