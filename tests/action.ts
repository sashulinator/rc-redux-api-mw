import * as CONSTANTS from "./constant";

import { APIAction, OnStart, OnFail, OnSuccess } from "../src/api.d";

import { REST_API } from "../src/constant";

type TestBody = {
  data: "test";
};

type StageFunctions = {
  onStart?: OnStart<TestBody>;
  onFail?: OnFail<TestBody>;
  onSuccess?: OnSuccess<TestBody>;
};

export const get = (stageAction?: StageFunctions): APIAction => {
  return {
    type: REST_API,
    stageActionTypes: CONSTANTS.GET,
    url: `/api/test/`,
    method: "get",
    ...stageAction,
  };
};
