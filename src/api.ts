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

      if (action.mockBody) return this.mockRequest(action, api);

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

  private async mockRequest(
    action: APIAction,
    api: MiddlewareAPI
  ): Promise<StageAction> {
    const abortController = new FakeAbortController();

    const startActionParams = { action, abortController };

    try {
      emitStageFunction(startActionParams);

      api.dispatch(APIActions.start(startActionParams));

      // TODO ms must be set by user
      console.warn(
        `Fake request was send! Wait for ${1000}ms to get fake data!`
      );

      const response = await new Promise((resolve) => {
        setTimeout(
          () => resolve({ status: 200, ok: true, body: action.mockBody }),
          1000
        );
      });

      const endActionParams = {
        body: action.mockBody,
        response: response as Response,
        ...startActionParams,
      };

      emitStageFunction(endActionParams);

      return api.dispatch(APIActions.success(endActionParams));
    } catch (e) {
      const requestError = e.toString();

      const FailActionParams = { abortController, action, requestError };

      emitStageFunction(FailActionParams);

      return api.dispatch(APIActions.fail(FailActionParams));
    }
  }
}
