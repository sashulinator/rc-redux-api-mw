import { MiddlewareAPI } from 'redux'

export type StageActionTypes = {
  START: string
  FAIL: string
  SUCCESS: string
}

export type ResponseBodyType = 'json' | 'text' | 'formData' | 'blob' | 'arrayBuffer' | 'readableStream'

export type APIAction<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> = Omit<
  RequestInit,
  'headers' | 'body'
> & {
  url: string
  type: string
  headers?: APIHeaders
  body?: RequestBody
  responseBodyType?: ResponseBodyType
  stageActionTypes: StageActionTypes
  onStart?: OnStart<ResponseBody, RequestBody, Payload>
  onSuccess?: OnSuccess<ResponseBody, RequestBody, Payload>
  onFail?: OnFail<ResponseBody, RequestBody, Payload>
  // put any data you want to receive in your reducer
  payload?: Payload
}

export type OnStart<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> = (
  params: StartActionParams<ResponseBody, RequestBody, Payload>,
) => void
export type OnFail<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> = (
  params: FailActionParams<ResponseBody, RequestBody, Payload>,
) => void
export type OnSuccess<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> = (
  params: SuccessActionParams<ResponseBody, RequestBody, Payload>,
) => void

export type StageAction<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> = {
  type: string
  payload: {
    abortController?: AbortController
    action: APIAction<ResponseBody, RequestBody, Payload>
    body?: ResponseBody
    response?: Response
  }
}

export type StartActionParams<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> = {
  abortController: AbortController
  action: APIAction<ResponseBody, RequestBody, Payload>
  config: Config<ResponseBody, RequestBody, Payload>
  store: MiddlewareAPI
}

export type StartAction<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> = {
  type: string
  payload: StartActionParams<ResponseBody, RequestBody, Payload>
}

export type SuccessActionParams<
  ResponseBody = unknown,
  RequestBody = unknown,
  Payload = unknown
> = StartActionParams & {
  body: ResponseBody
  request: Request
  response: Response
  config: Config<ResponseBody, RequestBody, Payload>
  store: MiddlewareAPI
}

export type SuccessAction<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> = {
  type: string
  payload: SuccessActionParams<ResponseBody, RequestBody, Payload>
}

export type FailActionParams<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> = StartActionParams<
  ResponseBody,
  RequestBody,
  Payload
> &
  Partial<SuccessActionParams<ResponseBody, RequestBody, Payload>> & {
    error?: string
    config: Config<ResponseBody, RequestBody, Payload>
    store: MiddlewareAPI
  }

export type FailAction<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> = {
  type: string
  payload: FailActionParams<ResponseBody, RequestBody, Payload>
}

export type BeforeFailParams<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> = {
  request: Request
  response: Response
  config: Config<ResponseBody, RequestBody, Payload>
  store: MiddlewareAPI
}

export type HeadersFormat = Headers | HeadersInit | undefined

export type APIHeaders<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> =
  | ((params: StartActionParams<ResponseBody, RequestBody, Payload>) => HeadersFormat)
  | HeadersFormat

export type Config<ResponseBody = unknown, RequestBody = unknown, Payload = unknown> = null | {
  beforeFail?: (
    params: StartActionParams<ResponseBody, RequestBody, Payload> & { response: Response; request: Request },
  ) => Promise<Request | void> | Request | void
  headers?: APIHeaders
  onStart?: OnStart<ResponseBody, RequestBody, Payload>
  onFail?: OnFail<ResponseBody, RequestBody, Payload>
  onSuccess?: OnSuccess<ResponseBody, RequestBody, Payload>
}
