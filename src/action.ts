// eslint-disable-next-line import/no-cycle
import {
  FailAction,
  FailActionParams,
  StartActionParams,
  StartAction,
  SuccessAction,
  SuccessActionParams,
} from './type'

export const onStart = (payload: StartActionParams): StartAction => {
  return {
    type: payload.action.stageActionTypes.START || 'REDUX_API_MIDDLEWARE | START',
    payload,
  }
}

export const onFail = (payload: FailActionParams): FailAction => {
  return {
    type: payload.action.stageActionTypes.FAIL || 'REDUX_API_MIDDLEWARE | FAIL',
    payload,
  }
}

export const onSuccess = (payload: SuccessActionParams): SuccessAction => {
  return {
    type: payload.action.stageActionTypes.SUCCESS || 'REDUX_API_MIDDLEWARE | SUCCESS',
    payload,
  }
}
