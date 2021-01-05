// eslint-disable-next-line import/no-cycle
import { APIAction, APIHeaders, FailActionParams, StartActionParams } from './type'

type StageFunctionName = 'onSuccess' | 'onFail' | 'onStart'

export function emitStageFunction(actionParams: FailActionParams): void {
  const { action, response, requestError } = actionParams

  let stageFunctionName: StageFunctionName = requestError ? 'onFail' : 'onStart'

  if (requestError) {
    console.error(`ReduxAPIMiddlewareRequestError: ${requestError}`)
  }

  if (response) {
    stageFunctionName = response.ok ? 'onSuccess' : 'onFail'
  }

  try {
    action[stageFunctionName]?.(actionParams as Required<FailActionParams>)
  } catch (e) {
    console.error(`ReduxAPIMiddleware${stageFunctionName}FunctionError: ${e}`)
  }
}

export async function getResponseBody(action: APIAction, response: Response): Promise<unknown> {
  const contentType = response.headers.get('Content-Type') || ''

  if (action.responseBodyType === 'readableStream') {
    return response.body
  }
  if (action.responseBodyType) {
    return response[action.responseBodyType]()
  }

  if (/json/.test(contentType)) {
    return response.json()
  }
  if (/text/.test(contentType)) {
    return response.text()
  }
  if (/form-data/.test(contentType)) {
    return response.formData()
  }

  return response.body
}

export function buildRequest(params: StartActionParams): Request {
  const { action, abortController } = params

  const body: string = typeof action.body !== 'string' ? JSON.stringify(action.body) : action.body

  const credentials = 'same-origin'

  const { method = 'get', url } = action

  const headers = buildHeaders(params)

  const request = new Request(url, {
    signal: abortController.signal,
    method,
    credentials,
    headers,
    body,
  })

  return request
}

function buildHeaders(params: StartActionParams): Headers {
  const { action, api } = params

  const apiObj = rawHeadersToObj(api.headers, params)
  const actionObj = rawHeadersToObj(action.headers, params)

  return new Headers({ ...apiObj, ...actionObj })
}

function rawHeadersToObj(rawHeaders: APIHeaders, params: StartActionParams): Record<string, string> {
  if (!rawHeaders) return {}

  if (isFunction<APIHeaders>(rawHeaders)) {
    rawHeaders = rawHeaders(params)
  }

  const headers = new Headers(rawHeaders as Headers)

  return Array.from(headers.entries()).reduce((acc: Record<string, string>, [key, value]: [string, string]) => {
    acc[key] = value
    return acc
  }, {})
}

function isFunction<A = unknown>(f: unknown): f is () => A {
  return typeof f === 'function'
}
