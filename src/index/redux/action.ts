import { REST_API } from '../../apiMiddleware/constant'

export const CONSTANTS = {
  START: 'CONSTANTS / GET / START',
  FAIL: 'CONSTANTS / GET / FAIL',
  SUCCESS: 'CONSTANTS / GET / SUCCESS',
}

export const get = () => ({
  type: REST_API,
  stageActionTypes: CONSTANTS,
  url: 'https://pokeapi.co/api/v2/pokemon/ditto',
  method: 'get',
  headers: (payload: any) => {
    const headers = new Headers({
      'Content-Type': 'text/html; charset=UTF-8',
    })

    const newHeaders = new Headers(headers)
    return newHeaders
  },
})
