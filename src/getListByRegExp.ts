import { Route, Routes } from "./route";

export function getListByRegExp(ROUTES: Routes, pathRE: RegExp): Route[] {
  const result = [];

  const keys = Object.keys(ROUTES);

  for (let i = 0; i < keys.length; i += 1) {
    const route = ROUTES[keys[i]];

    if (pathRE.test(route.PATH)) result.push(route);
  }

  return result;
}
