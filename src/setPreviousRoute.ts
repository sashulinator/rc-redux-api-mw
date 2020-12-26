import { Routes } from "./route";

let previous = "";
let current = "";

const setPreviousRoute = (routes: Routes) => {
  const { pathname } = window.location;

  const keys = Object.keys(routes);

  if (current === pathname) return;

  previous = current;
  current = pathname;

  for (let i = 0; i < keys.length; i += 1) {
    const iRoute = routes[keys[i]];

    iRoute.isPrevious = new RegExp(`${iRoute.PATH}$`).test(previous);
  }
};

export { setPreviousRoute };
