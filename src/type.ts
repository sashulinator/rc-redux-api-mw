import { AnyAction, MiddlewareAPI } from 'redux'
import { REDUX_API_MIDDLEWARE } from './constant'

export type StageActionTypes = {
  START: string
  FAIL: string
  SUCCESS: string
}

export enum ResponseBodyType {
  json = 'json',
  text = 'text',
  formData = 'formData',
  blob = 'blob',
  arrayBuffer = 'arrayBuffer',
  readableStream = 'readableStream',
}

type ActionName = 'endAction' | 'APIAction'

export interface APIAction<
  ResponseBody = unknown,
  RequestBody = unknown,
  Payload = unknown,
  DispatchReturns extends ActionName = 'APIAction'
> extends Omit<RequestInit, 'headers' | 'body'> {
  url: string
  type: typeof REDUX_API_MIDDLEWARE
  headers?: APIHeaders<ResponseBody, RequestBody, Payload>
  body?: RequestBody
  dispatchReturns?: DispatchReturns
  responseBodyType?: ResponseBodyType
  stageActionTypes: StageActionTypes
  onStart?: OnStart<ResponseBody, RequestBody, Payload>
  onSuccess?: OnSuccess<ResponseBody, RequestBody, Payload>
  onFail?: OnFail<ResponseBody, RequestBody, Payload>
  // put any data you want to receive in your reducer
  payload?: Payload
}

export type APIActionAlt<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> = APIAction<
  ResponseBody,
  RequestBody,
  Payload,
  'endAction'
>

export interface OnStart<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> {
  (params: StartActionParams<ResponseBody, RequestBody, Payload>): void
}
export interface OnFail<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> {
  (params: FailActionParams<ResponseBody, RequestBody, Payload>): void
}
export interface OnSuccess<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> {
  (params: SuccessActionParams<ResponseBody, RequestBody, Payload>): void
}

export interface StageAction<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> {
  type: string
  payload: {
    abortController?: AbortController
    action: APIAction<ResponseBody, RequestBody, Payload>
    body?: ResponseBody
    response?: Response
  }
}

export interface StartActionParams<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> {
  abortController: AbortController
  action: APIAction<ResponseBody, RequestBody, Payload>
  config: Config<ResponseBody, RequestBody, Payload> | null
  store: MiddlewareAPI
}

export interface StartAction<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> {
  type: string
  payload: StartActionParams<ResponseBody, RequestBody, Payload>
}

export interface SuccessActionParams<ResponseBody = unknown, RequestBody = unknown, Payload = unknown>
  extends StartActionParams {
  body: ResponseBody
  request: Request
  response: Response
  config: Config<ResponseBody, RequestBody, Payload> | null
  action: APIAction<ResponseBody, RequestBody, Payload>
}

export interface SuccessAction<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> {
  type: string
  payload: SuccessActionParams<ResponseBody, RequestBody, Payload>
}

export interface FailActionParams<ResponseBody = unknown, RequestBody = unknown, Payload = unknown>
  extends StartActionParams<ResponseBody, RequestBody, Payload> {
  body?: ResponseBody
  request?: Request
  response?: Response
  error?: string
  config: Config<ResponseBody, RequestBody, Payload> | null
  action: APIAction<ResponseBody, RequestBody, Payload>
}

export interface FailAction<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> {
  type: string
  payload: FailActionParams<ResponseBody, RequestBody, Payload>
}

export type EndAction<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> = FailAction<
  ResponseBody,
  RequestBody,
  Payload
>

export interface BeforeFailParams<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> {
  request: Request
  response: Response
  config: Config<ResponseBody, RequestBody, Payload> | null
  store: MiddlewareAPI
}

export type HeadersFormat = Headers | HeadersInit | undefined

export type APIHeaders<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> =
  | ((params: StartActionParams<ResponseBody, RequestBody, Payload>) => HeadersFormat)
  | HeadersFormat

export interface Config<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> {
  beforeFail?: (
    params: StartActionParams<ResponseBody, RequestBody, Payload> & { response: Response; request: Request },
  ) => Promise<Request | void> | Request | void
  headers?: APIHeaders<ResponseBody, RequestBody, Payload>
  onStart?: OnStart<ResponseBody, RequestBody, Payload>
  onFail?: OnFail<ResponseBody, RequestBody, Payload>
  onSuccess?: OnSuccess<ResponseBody, RequestBody, Payload>
}

export enum StageFunctionName {
  onSuccess = 'onSuccess',
  onFail = 'onFail',
  onStart = 'onStart',
}

declare module 'redux' {
  export type EndActionProperty = { dispatchReturns?: 'endAction' }
  export interface Dispatch {
    <T extends AnyAction, ResponseBody = unknown, RequestBody = unknown, Payload = unknown>(
      action: T,
    ): T extends EndActionProperty ? EndAction<ResponseBody, RequestBody, Payload> : T
  }
}
