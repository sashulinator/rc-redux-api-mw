import routes from "./mockRoutes";

test("routes.isCurrent", () => {
  expect(routes.ABOUT.isCurrent).toBe(false);

  window.history.pushState({}, "Page Title", routes.ABOUT.PATH);

  expect(routes.ABOUT.isCurrent).toBe(true);
  expect(routes.APP.isCurrent).toBe(false);
  expect(routes.USERS.isCurrent).toBe(false);
});

test("routes.isCurrent with param", () => {
  expect(routes.USER.isCurrent).toBe(false);

  window.history.pushState(
    {},
    "Page Title",
    routes.USER.PATH.replace(":id", "177")
  );

  expect(routes.USER.isCurrent).toBe(true);

  //

  expect(routes.USER_CATS.isCurrent).toBe(false);

  window.history.pushState(
    {},
    "Page Title",
    routes.USER_CATS.PATH.replace(":id", "177")
  );

  expect(routes.USER_CATS.isCurrent).toBe(true);
});

test("routes.isPartOf", () => {
  expect(routes.ABOUT.isPartOf(routes.ABOUT.PATH)).toBe(true);

  expect(routes.ABOUT.isPartOf(routes.USERS.PATH)).toBe(false);

  expect(routes.USERS.isPartOf(routes.USER.PATH)).toBe(true);

  expect(routes.USER.isPartOf(routes.USERS.PATH)).toBe(false);
});
