import { Route, Routes } from "./route";

export function getСurrent(ROUTES: Routes): Route | null {
  const keys = Object.keys(ROUTES);

  for (let i = 0; i < keys.length; i += 1) {
    const route = ROUTES[keys[i]];

    if (route.isCurrent) return route;
  }

  return null;
}
