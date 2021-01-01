import { APIMiddleware } from "../src/api";

import configureMockStore from "redux-mock-store";

import jestFetchMock from "jest-fetch-mock";

import * as fetchMock from "fetch-mock";

import * as actions from "./action";

import * as CONSTANTS from "./constant";
import { SuccessActionParams } from "../src/type";

const api = new APIMiddleware({
  refreshAction: actions.refresh,
});

const middlewares = [api.middleware()];

const mockStore = configureMockStore(middlewares);

// Data

const mockDataObj = JSON.stringify({
  test: "test",
});

const mockDataJson = JSON.stringify(mockDataObj);

const mockDataString = "test";

//  Headers

const headersJson = {
  headers: {
    "Content-Type": "application/json",
  },
};

// Tests

describe("async actions", () => {
  afterEach(() => {
    jestFetchMock.resetMocks();
  });

  it("basic", async (done) => {
    jestFetchMock.mockResponseOnce(mockDataJson, headersJson);

    const store = mockStore();

    await store.dispatch(
      actions.get({
        onStart(payload) {
          const { action, abortController } = payload;
          const { onStart, onFail, onSuccess } = action;

          expect((payload as any).response).toEqual(undefined);
          expect((payload as any).body).toEqual(undefined);

          expect(abortController instanceof AbortController).toBeTruthy();

          expect(action).toEqual(actions.get({ onStart, onFail, onSuccess }));
        },
        onFail() {
          done('Error: only "onSuccess" must be emited!');
        },
        onSuccess: async (payload) => {
          const { action, abortController, body, response } = payload;
          const { onStart, onFail, onSuccess } = action;

          expect(body).toEqual(mockDataObj);

          const equalResponse = new Response(mockDataJson, headersJson);
          await equalResponse.json();
          expect(response).toEqual(equalResponse);

          expect(abortController instanceof AbortController).toBeTruthy();

          expect(action).toEqual(actions.get({ onStart, onFail, onSuccess }));

          done();
        },
      })
    );
  });
});
