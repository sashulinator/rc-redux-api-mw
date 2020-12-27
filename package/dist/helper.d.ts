import { MiddlewareAPI } from "redux";
import { APIAction, FailActionParams } from "./type";
export declare function emitStageFunction(actionParams: FailActionParams): void;
export declare function getResponseBody(action: APIAction, response: Response): Promise<any>;
export declare function buildRequest(action: APIAction, api: MiddlewareAPI, abortController: AbortController, isRefresh: boolean): Request;
export declare class FakeAbortController implements AbortController {
    signal: null;
    abort(): void;
}
