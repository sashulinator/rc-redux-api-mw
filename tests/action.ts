import * as CONSTANTS from './constant'

import { APIAction, OnStart, OnFail, OnSuccess } from '../src/type'

import { REDUX_API_MIDDLEWARE } from '../src/constant'

type TestBody = {
  data: 'test'
}

type StageFunctions = {
  onStart?: OnStart<TestBody>
  onFail?: OnFail<TestBody>
  onSuccess?: OnSuccess<TestBody>
}

export const get = (stageAction?: StageFunctions): APIAction<unknown, TestBody> => {
  return {
    type: REDUX_API_MIDDLEWARE,
    stageActionTypes: CONSTANTS.GET,
    url: `/api/test/`,
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
