import { APIMiddleware } from "../src/api";

import configureMockStore from "redux-mock-store";

import fetchMock from "jest-fetch-mock";

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
    fetchMock.resetMocks();
  });

  it("basic", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: "test" }), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const store = mockStore();

    const result = await store.dispatch(actions.get());

    expect(result.payload.body.data).toEqual("test");
  });

  it("onStart", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: "test" }), {
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

    fetchMock.mockReject(new Error(errorMsg));

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

    fetchMock.mockResponses([errorMsg, { status: 500 }]);

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

    fetchMock.mockResponses([
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
    fetchMock.mockResponses(
      [undefined, { status: 401, url: "/getdata" }],
      [
        JSON.stringify({ token: "1111111", refreshToken: "7" }),
        { status: 200, headers: headersJson, url: "/refreshtoken" },
      ],
      [
        JSON.stringify({ data: "test" }),
        { status: 200, headers: headersJson, url: "/getdata" },
      ]
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
        onSuccess: ({ body }) => {
          expect(body.data).toEqual("test");
          expect(body.data).toEqual("test");
        },
      })
    );

    expect.assertions(3);
  });

  it("401 error. refresh token failed", async () => {
    fetchMock.mockResponses(
      [undefined, { status: 401, url: "/getdata" }],
      [undefined, { status: 401, url: "/refresh" }]
    );

    const store = mockStore();

    await store.dispatch(
      actions.get({
        onFail: ({ requestError, body }) => {
          expect(requestError).toEqual(undefined);
          expect(body).toEqual(undefined);
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
