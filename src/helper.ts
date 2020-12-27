import { APIAction } from "./api.d";

import { FailActionParams } from "./action";

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

export class FakeAbortController implements AbortController {
  signal: null;

  abort() {
    throw Error("Request aborted by user");
  }
}
