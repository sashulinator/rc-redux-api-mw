import { APIAction, APIHeaders, FailActionParams, StartActionParams, StageFunctionName } from './type'

import * as APIActions from './action'

export async function onStage(
  stageFunctionName: StageFunctionName,
  partialActionParams: FailActionParams,
): Promise<void> {
  const { config, action, store } = partialActionParams

  const actionParams = partialActionParams as Required<FailActionParams>

  store.dispatch(APIActions[stageFunctionName](actionParams))

  Promise.resolve(actionParams).then(config?.[stageFunctionName])
  Promise.resolve(actionParams).then(action[stageFunctionName])
}

export async function getResponseBody(action: APIAction, response: Response): Promise<unknown> {
  const contentType = response.headers.get('Content-Type') || ''

  if (action.responseBodyType === 'readableStream') {
    return response.body
  }

  if (response.ok && action.responseBodyType) {
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

  const {
    body,
    url,
    cache,
    credentials,
    integrity,
    keepalive,
    method,
    mode,
    redirect,
    referrer,
    referrerPolicy,
    signal,
    window,
  } = action

  const request = new Request(url, {
    signal: signal || abortController.signal,
    headers: buildHeaders(params),
    body: stringifyBody(body),
    method,
    cache,
    keepalive,
    integrity,
    credentials,
    mode,
    redirect,
    referrer,
    referrerPolicy,
    window,
  })

  return request
}

function stringifyBody(body: unknown): string {
  return typeof body !== 'string' ? JSON.stringify(body) : body
}

function buildHeaders(params: StartActionParams): Headers {
  const { action, config } = params

  const apiObj = rawHeadersToObj(config?.headers, params)
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
