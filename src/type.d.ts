export type StageActionTypes = {
  START: string;
  FAIL: string;
  SUCCESS: string;
};

export type ResponseBodyType =
  | "json"
  | "text"
  | "formData"
  | "blob"
  | "arrayBuffer"
  | "readableStream";

export type APIAction<RequestBody = unknown, ResponseBody = unknown> = {
  url: string;
  method?: string;
  type: string;
  body?: RequestBody;
  headers?: { [key: string]: string };
  mockBody?: any;
  onStart?: OnStart<ResponseBody>;
  onSuccess?: OnSuccess<ResponseBody>;
  onFail?: OnFail<ResponseBody>;
  payload?: any;
  responseBodyType: ResponseBodyType;
  stageActionTypes: StageActionTypes;
};

export type OnStart<Body = unknown> = (params: StartActionParams<Body>) => void;
export type OnFail<Body = unknown> = (params: FailActionParams<Body>) => void;
export type OnSuccess<Body = unknown> = (
  params: SuccessActionParams<Body>
) => void;

export type StageAction<ResponseBody = unknown, RequestBody = unknown> = {
  type: string;
  payload: {
    abortController?: AbortController;
    action: APIAction<RequestBody>;
    body?: ResponseBody;
    response?: Response;
  };
};

export type StartActionParams<Body = unknown> = {
  abortController: AbortController;
  action: APIAction<Body>;
};

export type StartAction<Body = unknown> = {
  type: string;
  payload: StartActionParams<Body>;
};

export type SuccessActionParams<Body = unknown> = StartActionParams & {
  body: Body;
  response: Response;
};

export type SuccessAction<Body = unknown> = {
  type: string;
  payload: SuccessActionParams<Body>;
};

export type FailActionParams<Body = unknown> = StartActionParams &
  Partial<SuccessActionParams<Body>> & { requestError?: string };

export type FailAction<Body = unknown> = {
  type: string;
  payload: FailActionParams<Body>;
};

export type Settings = {
  refreshAction: () => APIAction;
};
