import routes from "./mockRoutes";

import { setPreviousRoute } from "../src/index";

test("setPreviousRoute", () => {
  window.history.pushState({}, "Page Title", routes.ABOUT.PATH);
  setPreviousRoute(routes as any);
  window.history.pushState({}, "Page Title", routes.USERS.PATH);
  setPreviousRoute(routes as any);

  expect(routes.ABOUT.isPrevious).toBe(true);
  expect(routes.USERS.isPrevious).toBe(false);

  setPreviousRoute(routes as any);

  expect(routes.ABOUT.isPrevious).toBe(true);
  expect(routes.USERS.isPrevious).toBe(false);
});
