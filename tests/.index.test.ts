import APIMiddleware from '../src/api'

import configureMockStore from 'redux-mock-store'

import jestFetchMock from 'jest-fetch-mock'
import * as actions from './action'

import * as CONSTANTS from './constant'
import { APIAction, SuccessActionParams } from '../src/type'
import { REDUX_API_MIDDLEWARE } from '../src/constant'
import { tokenToString } from 'typescript'

localStorage.setItem('token', 'pPOiItf7tyd65xiFg8vuIc81c6c61O3g9')
localStorage.setItem('refreshToken', 'pPgjx4sl0yd65xikp08jlIc81c6c8gy5d')

// Data

const mockDataObj = JSON.stringify({
  test: 'test',
})

const mockDataJson = JSON.stringify(mockDataObj)

const mockDataString = 'test'

//  Headers

const headersJson = {
  headers: {
    'Content-Type': 'application/json',
  },
}

// Tests

describe('async actions', () => {
  afterEach(() => {
    jestFetchMock.resetMocks()
  })

  it('basic', async (done) => {
    const api = new APIMiddleware()

    const middlewares = [api.middleware()]

    const mockStore = configureMockStore(middlewares)

    jestFetchMock.mockResponseOnce(mockDataJson, headersJson)

    const store = mockStore()

    await store.dispatch(
      actions.get({
        onStart(payload) {
          const { action, abortController } = payload
          const { onStart, onFail, onSuccess } = action

          expect((payload as any).response).toEqual(undefined)
          expect((payload as any).body).toEqual(undefined)

          expect(abortController instanceof AbortController).toBeTruthy()

          expect(action).toEqual(actions.get({ onStart, onFail, onSuccess }))
        },
        onFail() {
          done('Error: only "onSuccess" must be emited!')
        },
        onSuccess: async (payload) => {
          const { action, abortController, body, response } = payload
          const { onStart, onFail, onSuccess } = action

          expect(body).toEqual(mockDataObj)

          const equalResponse = new Response(mockDataJson, headersJson)
          await equalResponse.json()
          expect(response).toEqual(equalResponse)

          expect(abortController instanceof AbortController).toBeTruthy()

          expect(action).toEqual(actions.get({ onStart, onFail, onSuccess }))

          done()
        },
      }),
    )
  })

  it('SHOULD return action', async (done) => {
    const api = new APIMiddleware()

    const middlewares = [api.middleware()]

    const mockStore = configureMockStore(middlewares)

    const store = mockStore()

    jestFetchMock.mockResponseOnce(mockDataJson, headersJson)

    const result = await store.dispatch(actions.get())

    expect(result.type).toEqual(REDUX_API_MIDDLEWARE)
    done()
  })

  it('SHOULD return result', async (done) => {
    const api = new APIMiddleware()

    const middlewares = [api.middleware()]

    const mockStore = configureMockStore(middlewares)

    const store = mockStore()

    jestFetchMock.mockResponseOnce(mockDataJson, headersJson)

    const result = await store.dispatch(actions.getWithResult())

    expect(result.payload.action.type).toEqual(REDUX_API_MIDDLEWARE)
    done()
  })

  it('handle 403', async (done) => {
    const api = new APIMiddleware({
      headers: ({ action }) => {
        return new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        })
      },
      beforeFail: async ({ response, store, action, request }) => {
        const refreshToken = localStorage.getItem('refreshToken')
        const url = '/api/v1/refresh_token'

        if (response.status === 403 && refreshToken && url !== action.url) {
          await store.dispatch({
            type: REDUX_API_MIDDLEWARE,
            url,
            method: 'post',
            body: refreshToken,
            stageActionTypes: { START: 'start', FAIL: 'fail', SUCCESS: 'success' },
            onSuccess: ({ body }) => {
              console.log('refresh body', body)
            },
          } as APIAction)

          return new Request(request)
        }
      },
    })

    const middlewares = [api.middleware()]

    const mockStore = configureMockStore(middlewares)

    jestFetchMock.mockResponses(
      ['', { status: 403 }],
      [JSON.stringify({ token: 'token', refreshToken: 'refreshToken' }), { status: 200 }],
      ['', { status: 200 }],
    )

    const store = mockStore()

    await store.dispatch(
      actions.get({
        onStart(payload) {
          done()
        },
        onFail() {
          done('Error: only "onSuccess" must be emited!')
        },
        onSuccess: async (payload) => {
          done()
        },
      }),
    )
  })
})
