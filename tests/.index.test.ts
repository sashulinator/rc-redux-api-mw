import { APIMiddleware } from "../src/api";

import configureMockStore from "redux-mock-store";

import jestFetchMock from "jest-fetch-mock";

import * as fetchMock from "fetch-mock";

import * as actions from "./action";

import * as CONSTANTS from "./constant";

const api = new APIMiddleware({
  refreshAction: actions.refresh,
});

const headersJson = {
  "Content-Type": "application/json",
};

const middlewares = [api.middleware()];
const mockStore = configureMockStore(middlewares);

describe("async actions", () => {
  afterEach(() => {
    jestFetchMock.resetMocks();
  });

  it("basic", async () => {
    jestFetchMock.mockResponseOnce(JSON.stringify({ data: "test" }), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const store = mockStore();

    const result = await store.dispatch(actions.get());

    expect(result.payload.body.data).toEqual("test");
  });

  it("onStart", async () => {
    jestFetchMock.mockResponseOnce(JSON.stringify({ data: "test" }), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const store = mockStore();

    await store.dispatch(
      actions.get({
        onSuccess: ({ body }) => {
          expect(body.data).toEqual("test");
          expect(body.data).toEqual("test");
        },
        onFail: ({ body }) => {
          expect(body.data).toEqual(null);
        },
        onStart: ({ action }) => {
          expect(action.stageActionTypes).toEqual(CONSTANTS.GET);
        },
      })
    );

    expect.assertions(3);
  });

  it("onFail when reject", async () => {
    const errorMsg = "It is normal to see this error message in tests! Go on!";

    jestFetchMock.mockReject(new Error(errorMsg));

    const store = mockStore();

    await store.dispatch(
      actions.get({
        onFail: ({ requestError, response }) => {
          expect(requestError).toEqual(`Error: ${errorMsg}`);
          expect(response).toEqual(undefined);
        },
        onStart: ({ action }) => {
          expect(action.stageActionTypes).toEqual(CONSTANTS.GET);
        },
        onSuccess: ({ response }) => {
          expect(response).toEqual("I should not be here");
        },
      })
    );

    expect.assertions(3);
  });

  it("onFail server error", async () => {
    const errorMsg = "Server Error";

    jestFetchMock.mockResponses([errorMsg, { status: 500 }]);

    const store = mockStore();

    await store.dispatch(
      actions.get({
        onFail: ({ requestError, response }) => {
          expect(requestError).toEqual(undefined);
          expect(requestError).toEqual(undefined);
        },
        onStart: ({ action }) => {
          expect(action.stageActionTypes).toEqual(CONSTANTS.GET);
        },
        onSuccess: ({ response }) => {
          expect(response).toEqual("I should not be here");
        },
      })
    );

    expect.assertions(3);
  });

  it("onFail wrong content-type", async () => {
    const errorMsg = "Server Error";

    jestFetchMock.mockResponses([
      errorMsg,
      {
        status: 500,
        headers: headersJson,
      },
    ]);

    const store = mockStore();

    await store.dispatch(
      actions.get({
        onFail: ({ requestError, response }) => {
          expect(requestError).toEqual(
            "FetchError: invalid json response body at  reason: Unexpected token S in JSON at position 0"
          );
          expect(response).toEqual(undefined);
        },
        onStart: ({ action }) => {
          expect(action.stageActionTypes).toEqual(CONSTANTS.GET);
        },
        onSuccess: ({ response }) => {
          expect(response).toEqual("I should not be here");
        },
      })
    );

    expect.assertions(3);
  });

  it("401 error. refresh token", async () => {
    jestFetchMock.mockResponses(
      [undefined, { status: 401, url: "/getdata" }],
      [
        JSON.stringify({ token: "1111111", refreshToken: "7" }),
        { status: 200, headers: headersJson },
      ],
      [JSON.stringify({ data: "test" }), { status: 200, headers: headersJson }]
    );

    const store = mockStore();

    await store.dispatch(
      actions.get({
        onFail: ({ response }) => {
          expect(response).toEqual(
            "I should not be here 401 error. refresh token"
          );
        },
        onStart: ({ action }) => {
          expect(action.stageActionTypes).toEqual(CONSTANTS.GET);
        },
        onSuccess: ({ body, response }) => {
          console.log(response);

          expect(body.data).toEqual("test");
          expect(body.data).toEqual("test");
        },
      })
    );

    expect.assertions(3);
  });

  it("401 error. refresh token failed", async () => {
    fetchMock.mock("/api/test/", 401);

    // (
    //   [undefined, { status: 401, url: "/getdata" }],
    //   [undefined, { status: 401, url: "/refresh" }]
    // );

    const store = mockStore();

    await store.dispatch(
      actions.get({
        onFail: ({ requestError, body, response }) => {
          console.log(response);

          expect(requestError).toEqual(undefined);
          expect(body).toEqual(null);
        },
        onStart: ({ action }) => {
          expect(action.stageActionTypes).toEqual(CONSTANTS.GET);
        },
        onSuccess: ({ response }) => {
          expect(response).toEqual(
            "I should not be here 401 error. refresh token failed"
          );
        },
      })
    );

    expect.assertions(3);
  });
});
