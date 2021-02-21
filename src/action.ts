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
    type: payload.action.stageActionTypes.START || 'REST_API | START',
    payload,
  }
}

export const onFail = (payload: FailActionParams): FailAction => {
  return {
    type: payload.action.stageActionTypes.FAIL || 'REST_API | FAIL',
    payload,
  }
}

export const onSuccess = (payload: SuccessActionParams): SuccessAction => {
  return {
    type: payload.action.stageActionTypes.SUCCESS || 'REST_API | SUCCESS',
    payload,
  }
}
