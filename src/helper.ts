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

export class FakeAbortController implements AbortController {
  signal: null;

  abort() {
    throw Error("Request aborted by user");
  }
}
