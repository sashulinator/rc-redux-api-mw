import { Middleware, Dispatch, MiddlewareAPI } from "redux";

import * as APIActions from "./action";

import { REST_API } from "./constant";

import {
  buildRequest,
  emitStageFunction,
  getResponseBody,
  FakeAbortController,
} from "./helper";

import { APIAction, Settings, StageAction } from "./type";

export class APIMiddleware {
  refreshAction?: Settings["refreshAction"];

  headers?: Settings["headers"];

  constructor(settings?: Settings) {
    this.refreshAction = settings?.refreshAction;
    this.headers = settings?.headers;
  }

  public middleware = (): Middleware<Dispatch<APIAction>> => {
    return (api) => (next) => async (
      action: APIAction
    ): Promise<APIAction | StageAction> => {
      if (action.type !== REST_API) {
        return next(action);
      }

      return this.request(action, api);
    };
  };

  private async request(
    action: APIAction,
    api: MiddlewareAPI
  ): Promise<StageAction> {
    const abortController = new AbortController();

    const startActionParams = { action, abortController };

    try {
      emitStageFunction(startActionParams);

      api.dispatch(APIActions.start(startActionParams));

      const response = await this.fetch(api, action, abortController);

      const body = await getResponseBody(action, response);

      const endActionParams = { body, response, ...startActionParams };

      emitStageFunction(endActionParams);

      return api.dispatch(
        APIActions[response.ok ? "success" : "fail"](endActionParams)
      );
    } catch (e) {
      const requestError = e.toString();

      const failActionParams = { requestError, ...startActionParams };

      emitStageFunction(failActionParams);

      return api.dispatch(APIActions.fail(failActionParams));
    }
  }

  private async refreshToken(
    api: MiddlewareAPI,
    refreshAction: APIAction
  ): Promise<boolean> {
    const result = await api.dispatch(refreshAction);

    // TODO it must be client function
    if (result?.payload?.body?.token && result?.payload?.body?.refreshToken) {
      localStorage.setItem("token", result?.payload?.body?.token);
      localStorage.setItem("refreshToken", result?.payload?.body?.refreshToken);

      return true;
    }

    // TODO client must do smth if failed
    return false;
  }

  private async fetch(
    api: MiddlewareAPI,
    action: APIAction,
    abortController: AbortController
  ): Promise<Response> {
    const refreshAction = this.refreshAction?.();

    const isRefresh = refreshAction && action.url === refreshAction.url;

    const request = buildRequest(this, action, abortController, isRefresh);

    let response = await fetch(request);

    if (response.status === 401 && !isRefresh) {
      const isSuccess = await this.refreshToken(api, refreshAction);

      if (isSuccess) {
        response = await fetch(request);
      }
    }

    return response;
  }
}
