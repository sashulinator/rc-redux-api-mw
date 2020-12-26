import { Middleware, Dispatch, MiddlewareAPI } from "redux";

import { REST_API } from "./constant";

import { emitStageFunction, FakeAbortController } from "./helper";

import * as APIActions from "./action";

import {
  APIAction,
  ActionOnProgress,
  Settings,
  ProgressActionTypes,
} from "./api.d";

export class APIMiddleware {
  next!: Dispatch<APIAction>;

  refreshActionTypes?: ProgressActionTypes;

  constructor(settings?: Settings) {
    this.refreshActionTypes = settings?.refreshActionTypes;
  }

  public middleware = (): Middleware<Dispatch<APIAction>> => {
    return (api) => (next) => async (
      action: APIAction
    ): Promise<APIAction | ActionOnProgress> => {
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
  ): Promise<ActionOnProgress> {
    const abortController = new AbortController();

    const startActionParams = { action, abortController };

    try {
      emitStageFunction(startActionParams);

      api.dispatch(APIActions.start(startActionParams));

      const response = await this.fetch(action, abortController);

      if (response.status === 401 && this.refreshActionTypes) {
        // TODO refresh url!
        if (action.url !== "/api/v1/refresh") {
          this.refreshToken(api, action);
        } else {
          // TODO do smth!!
        }
      }

      const body = await APIMiddleware.getResponseBody(response);

      const endActionParams = { body, response, ...startActionParams };

      emitStageFunction(endActionParams);

      return api.dispatch(APIActions.success(endActionParams));
    } catch (e) {
      const requestError = e.toString();

      const FailActionParams = { abortController, action, requestError };

      emitStageFunction(FailActionParams);

      return api.dispatch(APIActions.fail(FailActionParams));
    }
  }

  private static async getResponseBody(response: Response): Promise<any> {
    const contentType = response.headers.get("Content-Type") || "";

    let data;

    if (/json/.test(contentType)) {
      data = await response.json();
    } else if (/text/.test(contentType)) {
      data = await response.text();
    } else {
      throw Error(
        "ReduxAPIMiddlewareError: Response Content-Type is neither json nor text"
      );
    }

    return data;
  }

  private async mockRequest(
    action: APIAction,
    api: MiddlewareAPI
  ): Promise<ActionOnProgress> {
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

  private async refreshToken(
    api: MiddlewareAPI,
    action: APIAction
  ): Promise<APIAction> {
    // TODO refresh must by client action
    await api.dispatch({
      type: REST_API,
      url: "/api/v1/refresh",
      method: "post",
      stageActionTypes: this.refreshActionTypes,
    });

    return api.dispatch(action);
  }

  // eslint-disable-next-line class-methods-use-this
  private async fetch(
    action: APIAction,
    controller: AbortController
  ): Promise<Response> {
    const token = /refresh$/.test(action.url)
      ? localStorage.getItem("refresh_token")
      : localStorage.getItem("token");

    const body: string =
      typeof action.body !== "string"
        ? JSON.stringify(action.body)
        : action.body;

    const credentials = "same-origin";

    const { headers, method = "get", url } = action;

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      signal: controller.signal,
      method,
      credentials,
      headers,
      body,
    });

    return response;
  }
}
