import { Route, Routes } from "./route";

export function getListForEveryLocation(
  ROUTES: Routes,
  pathnameArg?: string
): Route[] {
  const pathname = pathnameArg || window.location.pathname;

  const routesResult: Route[] = [];

  const keys = Object.keys(ROUTES);

  for (let i = 0; i < keys.length; i += 1) {
    const route = ROUTES[keys[i]];

    if (route.isPartOf(pathname)) routesResult.push(route);
  }

  routesResult.sort((a, b) => (a.PATH.length > b.PATH.length ? 1 : -1));

  return routesResult;
}
