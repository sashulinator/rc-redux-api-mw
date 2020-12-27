import {
  FailAction,
  FailActionParams,
  StartActionParams,
  StartAction,
  SuccessAction,
  SuccessActionParams,
} from "./type";

export const start = (payload: StartActionParams): StartAction => {
  return {
    type: payload.action.stageActionTypes.START,
    payload,
  };
};

export const fail = (payload: FailActionParams): FailAction => {
  return {
    type: payload.action.stageActionTypes.FAIL,
    payload,
  };
};

export const success = (payload: SuccessActionParams): SuccessAction => {
  return {
    type: payload.action.stageActionTypes.SUCCESS,
    payload,
  };
};
