import { MiddlewareAPI } from "redux";

import { APIAction, FailActionParams } from "./type";

type StageFunctionName = "onSuccess" | "onFail" | "onStart";

export function emitStageFunction(actionParams: FailActionParams) {
  const { action, response, requestError } = actionParams;

  let stageFunctionName: StageFunctionName = requestError
    ? "onFail"
    : "onStart";

  if (requestError) {
    console.error(`ReduxAPIMiddlewareRequestError: ${requestError}`);
  }

  if (response) {
    stageFunctionName = response.ok ? "onSuccess" : "onFail";
  }

  try {
    action[stageFunctionName]?.(actionParams as Required<FailActionParams>);
  } catch (e) {
    console.error(`ReduxAPIMiddleware${stageFunctionName}FunctionError: ${e}`);
  }
}

export async function getResponseBody(
  action: APIAction,
  response: Response
): Promise<any> {
  const contentType = response.headers.get("Content-Type");

  if (action.responseBodyType === "readableStream") {
    return response.body;
  } else if (action.responseBodyType) {
    return await response[action.responseBodyType]();
  }

  if (/json/.test(contentType)) {
    return await response.json();
  } else if (/text/.test(contentType)) {
    return await response.text();
  } else if (/form-data/.test(contentType)) {
    return await response.formData();
  } else {
    return response.body;
  }
}

export function buildRequest(
  action: APIAction,
  api: MiddlewareAPI,
  abortController: AbortController,
  isRefresh: boolean
): Request {
  const token = isRefresh
    ? localStorage.getItem("refreshToken")
    : localStorage.getItem("token");

  const body: string =
    typeof action.body !== "string" ? JSON.stringify(action.body) : action.body;

  const credentials = "same-origin";

  const { headers = {}, method = "get", url } = action;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const request = new Request(url, {
    signal: abortController.signal,
    method,
    credentials,
    headers,
    body,
  });

  return request;
}

export class FakeAbortController implements AbortController {
  signal: null;

  abort() {
    throw Error("Request aborted by user");
  }
}
