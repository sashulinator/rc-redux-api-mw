import { APIAction, FailActionParams, StartActionParams } from './type'

type StageFunctionName = 'onSuccess' | 'onFail' | 'onStart'

export function emitStageFunction(actionParams: FailActionParams) {
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

export async function getResponseBody(action: APIAction, response: Response): Promise<any> {
  const contentType = response.headers.get('Content-Type') || ''

  if (action.responseBodyType === 'readableStream') {
    return response.body
  } else if (action.responseBodyType) {
    return await response[action.responseBodyType]()
  }

  if (/json/.test(contentType)) {
    return await response.json()
  } else if (/text/.test(contentType)) {
    return await response.text()
  } else if (/form-data/.test(contentType)) {
    return await response.formData()
  } else {
    return response.body
  }
}

export function buildRequest(params: StartActionParams): Request {
  const { action, abortController } = params
  // const token = isRefresh
  //   ? localStorage.getItem("refreshToken")
  //   : localStorage.getItem("token");

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

  const currentHeaders = action.headers?.(params) || api.headers?.(params) || {}

  if (currentHeaders instanceof Headers) return currentHeaders

  // use destructuring to avoit typescript error "wrong index signature"
  return new Headers({ ...currentHeaders })
}
