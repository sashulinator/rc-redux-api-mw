import * as CONSTANTS from './constant'

import { APIAction, OnStart, OnFail, OnSuccess, APIActionAlt } from '../src/type'

import { REDUX_API_MIDDLEWARE } from '../src/constant'

type TestBody = {
  data: 'test'
}

type StageFunctions<Body> = {
  onStart?: OnStart<Body>
  onFail?: OnFail<Body>
  onSuccess?: OnSuccess<Body>
}

export const get = (stageAction?: StageFunctions<TestBody>): APIAction<TestBody> => {
  return {
    type: REDUX_API_MIDDLEWARE,
    stageActionTypes: CONSTANTS.GET,
    url: `/api/test/`,
    method: 'get',
    ...stageAction,
  }
}

// type Test = APIAction<TestBody> & { returnResult: true }

export const getWithResult = (stageAction?: StageFunctions<TestBody>): APIActionAlt<TestBody> => {
  return {
    type: REDUX_API_MIDDLEWARE,
    stageActionTypes: CONSTANTS.GET,
    url: `/api/test/`,
    dispatchReturns: 'endAction',
    method: 'get',
    ...stageAction,
  }
}

export const refresh = (): APIAction => {
  return {
    type: REDUX_API_MIDDLEWARE,
    stageActionTypes: CONSTANTS.REFRESH,
    url: `/api/refresh/`,
    method: 'post',
  }
}
