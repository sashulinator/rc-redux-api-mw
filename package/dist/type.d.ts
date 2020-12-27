export declare type StageActionTypes = {
    START: string;
    FAIL: string;
    SUCCESS: string;
};
export declare type ResponseBodyType = "json" | "text" | "formData" | "blob" | "arrayBuffer" | "readableStream";
export declare type APIAction<RequestBody = unknown, ResponseBody = unknown> = {
    url: string;
    method?: string;
    type: string;
    body?: RequestBody;
    headers?: {
        [key: string]: string;
    };
    mockBody?: any;
    onStart?: OnStart<ResponseBody>;
    onSuccess?: OnSuccess<ResponseBody>;
    onFail?: OnFail<ResponseBody>;
    payload?: any;
    responseBodyType?: ResponseBodyType;
    stageActionTypes: StageActionTypes;
};
export declare type OnStart<Body = unknown> = (params: StartActionParams<Body>) => void;
export declare type OnFail<Body = unknown> = (params: FailActionParams<Body>) => void;
export declare type OnSuccess<Body = unknown> = (params: SuccessActionParams<Body>) => void;
export declare type StageAction<ResponseBody = unknown, RequestBody = unknown> = {
    type: string;
    payload: {
        abortController?: AbortController;
        action: APIAction<RequestBody>;
        body?: ResponseBody;
        response?: Response;
    };
};
export declare type StartActionParams<Body = unknown> = {
    abortController: AbortController;
    action: APIAction<Body>;
};
export declare type StartAction<Body = unknown> = {
    type: string;
    payload: StartActionParams<Body>;
};
export declare type SuccessActionParams<Body = unknown> = StartActionParams & {
    body: Body;
    response: Response;
};
export declare type SuccessAction<Body = unknown> = {
    type: string;
    payload: SuccessActionParams<Body>;
};
export declare type FailActionParams<Body = unknown> = StartActionParams & Partial<SuccessActionParams<Body>> & {
    requestError?: string;
};
export declare type FailAction<Body = unknown> = {
    type: string;
    payload: FailActionParams<Body>;
};
export declare type Settings = {
    refreshAction: () => APIAction;
};
