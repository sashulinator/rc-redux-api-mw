import { APIMiddleware } from "../src/api";

import configureMockStore from "redux-mock-store";

import jestFetchMock from "jest-fetch-mock";

import * as fetchMock from "fetch-mock";

import * as actions from "./action";

import * as CONSTANTS from "./constant";
import { SuccessActionParams } from "../src/type";

localStorage.setItem("token", "pPOiItf7tyd65xiFg8vuIc81c6c61O3g9");

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
    const api = new APIMiddleware({
      refreshAction: actions.refresh,
    });

    const middlewares = [api.middleware()];

    const mockStore = configureMockStore(middlewares);

    jestFetchMock.mockResponseOnce(mockDataJson, headersJson);

    const store = mockStore();

    await store.dispatch(
      actions.get({
        onStart(payload) {
          const { action, abortController } = payload;
          const { onStart, onFail, onSuccess } = action;

          // @ts-expect-error
          expect(payload.response).toEqual(undefined);
          // @ts-expect-error
          expect(payload.body).toEqual(undefined);

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

  it("headers", async (done) => {
    const api = new APIMiddleware({
      refreshAction: actions.refresh,
      headers: ({ action }) => {
        return new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        });
      },
    });

    const middlewares = [api.middleware()];

    const mockStore = configureMockStore(middlewares);

    jestFetchMock.mockResponseOnce(mockDataJson, headersJson);

    const store = mockStore();

    await store.dispatch(
      actions.get({
        onStart(payload) {
          //
          done();
        },
        onFail() {
          // done('Error: only "onSuccess" must be emited!');
          done('Error: only "onSuccess" must be emited!');
        },
        onSuccess: async (payload) => {
          //
          done();
        },
      })
    );
  });
});
