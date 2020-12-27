import { FailAction, FailActionParams, StartActionParams, StartAction, SuccessAction, SuccessActionParams } from "./type";
export declare const start: (payload: StartActionParams) => StartAction;
export declare const fail: (payload: FailActionParams) => FailAction;
export declare const success: (payload: SuccessActionParams) => SuccessAction;
