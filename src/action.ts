import { APIAction } from "./api.d";

// Start

export type StartActionParams<Body = unknown> = {
  abortController: AbortController;
  action: APIAction<Body>;
};

export type StartAction<Body = unknown> = {
  type: string;
  payload: StartActionParams<Body>;
};

// Success

export type SuccessActionParams<Body = unknown> = StartActionParams & {
  body: Body;
  response: Response;
};

export type SuccessAction<Body = unknown> = {
  type: string;
  payload: SuccessActionParams<Body>;
};

// Fail

export type FailActionParams<Body = unknown> = StartActionParams &
  Partial<SuccessActionParams<Body>> & { requestError?: string };

export type FailAction<Body = unknown> = {
  type: string;
  payload: FailActionParams<Body>;
};

// Actions

export const start = (payload: StartActionParams): StartAction => {
  return {
    type: payload.action.stageActionTypes.START,
    payload,
  };
};

export const fail = (payload: FailActionParams): FailAction => {
  return {
    type: payload.action.stageActionTypes.FAIL,
    payload,
  };
};

export const success = (payload: SuccessActionParams): SuccessAction => {
  return {
    type: payload.action.stageActionTypes.SUCCESS,
    payload,
  };
};
