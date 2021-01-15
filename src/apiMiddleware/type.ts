import { MiddlewareAPI } from 'redux'
// eslint-disable-next-line import/no-cycle
import { APIMiddleware } from './api'

export type StageActionTypes = {
  START: string
  FAIL: string
  SUCCESS: string
}

export type ResponseBodyType = 'json' | 'text' | 'formData' | 'blob' | 'arrayBuffer' | 'readableStream'

export type APIAction<RequestBody = unknown, ResponseBody = unknown> = Omit<RequestInit, 'headers' | 'body'> & {
  url: string
  type: string
  headers?: APIHeaders
  body?: RequestBody

  mockResponse?: Response

  responseBodyType?: ResponseBodyType
  stageActionTypes: StageActionTypes
  /*
  put any data you want to receive in your reducer
  */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any

  onStart?: OnStart<ResponseBody>
  onSuccess?: OnSuccess<ResponseBody>
  onFail?: OnFail<ResponseBody>
}

export type OnStart<Body = unknown> = (params: StartActionParams<Body>) => void
export type OnFail<Body = unknown> = (params: FailActionParams<Body>) => void
export type OnSuccess<Body = unknown> = (params: SuccessActionParams<Body>) => void

export type StageAction<ResponseBody = unknown, RequestBody = unknown> = {
  type: string
  payload: {
    abortController?: AbortController
    action: APIAction<RequestBody>
    body?: ResponseBody
    response?: Response
  }
}

export type StartActionParams<Body = unknown> = {
  abortController: AbortController
  action: APIAction<Body>
  api: APIMiddleware
  store: MiddlewareAPI
}

export type StartAction<Body = unknown> = {
  type: string
  payload: StartActionParams<Body>
}

export type SuccessActionParams<Body = unknown> = StartActionParams & {
  body: Body
  request: Request
  response: Response
  api: APIMiddleware
  store: MiddlewareAPI
}

export type SuccessAction<Body = unknown> = {
  type: string
  payload: SuccessActionParams<Body>
}

export type FailActionParams<Body = unknown> = StartActionParams &
  Partial<SuccessActionParams<Body>> & {
    requestError?: string
    api: APIMiddleware
    store: MiddlewareAPI
  }

export type FailAction<Body = unknown> = {
  type: string
  payload: FailActionParams<Body>
}

export type HandleFailedRequestParams = {
  request: Request
  response: Response
  api: APIMiddleware
  store: MiddlewareAPI
}

export type HeadersFormat = Headers | HeadersInit | undefined

export type APIHeaders = ((params: StartActionParams) => HeadersFormat) | HeadersFormat

export type Settings = {
  handleFailedRequest?: (
    params: StartActionParams & { response: Response; request: Request },
  ) => Promise<Request | void> | Request | void
  headers?: APIHeaders
  onStart?: OnStart
  onFail?: OnFail
  onSuccess?: OnSuccess
}
