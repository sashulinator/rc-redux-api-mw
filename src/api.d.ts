import {
  SuccessActionParams,
  FailActionParams,
  StartActionParams,
} from "./action";

export type ProgressActionTypes = {
  START: string;
  FAIL: string;
  SUCCESS: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Action<P = any> = {
  type: string;
  payload: P;
};

export type APIAction<
  Body = unknown,
  Query = Record<string, number | string>
> = {
  type: string;
  url: string;
  body?: Body;
  method?: string;
  headers?: { [key: string]: string };
  stageActionTypes: ProgressActionTypes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockBody?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onStart?: OnStart<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess?: OnSuccess<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFail?: OnFail<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: Query;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
};

export type OnStart<Body = unknown> = (params: StartActionParams<Body>) => void;
export type OnFail<Body = unknown> = (params: FailActionParams<Body>) => void;
export type OnSuccess<Body = unknown> = (
  params: SuccessActionParams<Body>
) => void;

export type ActionOnProgress<
  ResponseData = unknown,
  ApiActionBody = unknown,
  ApiActionQuery = Record<string, number | string>
> = {
  type: string;
  payload: {
    body?: ResponseData & {
      error?: "";
      totalElements?: number;
    };
    action: APIAction<ApiActionBody, ApiActionQuery>;
    response?: Response;
    abortController?: AbortController;
  };
};

export type Settings = {
  onRequestAbort?: () => void;
  onResposeHasError?: () => void;
  refreshAction: () => APIAction;
};
