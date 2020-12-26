## What is it

Do you have a file `src/constants/routes.js`? Good. This libary will help you with it. See example:

```ts
const ROUTES = {
  LOGIN: Route.new("Login page", "/login"),
  MAIN: Route.new("Main page", "/", { REDIRECT: "/main" }),
};

console.log(ROUTES);
// {
//   LOGIN: {
//     NAME: 'Login page'
//     PATH: '/login'
//     REDIRECT: undefined
//     isCurrent: false,
//     isPrevious: false,
//     isPartOf: (string) => boolean
//     ...
//   },
//   MAIN: {
//     NAME: 'Main page'
//     PATH: '/'
//     REDIRECT: '/main'
//     isCurrent: false,
//     isPrevious: false,
//     isPartOf: (string) => boolean
//     ...
//   }
// }
```

## How to start

### Route constant

To create constants I highly recommend using a class instead of an object because of autocompletion and ...

```ts
import Route from "@savchenko91/rc-route-constant";

class ROUTES {
  public readonly ABOUT: Route;
  public readonly ABOUT_ME: Route;
  public readonly ABOUT_MY_CAT: Route;
  public readonly MAIN: Route;

  constructor() {
    this.MAIN = Route.new("main page", `/`);

    const about = "/about";

    this.ABOUT_MY = Route.new("about me", about);

    this.ABOUT_MY_CAT = Route.new("about my cat", `${about}/my-cat`, {
      LABEL: "about-my-cat",
    });

    // ...You can't do smth like this in object assertion
    this.ABOUT = Route.new("about", `${about}/me`, {
      REDIRECT: this.ABOUT_MY.PATH,
    });
  }
}

export default new ROUTES();
```

### Set previous

Use function `setPreviousRoute` to set property `isPrevious`

```ts
import { useLocation } from "react-router-dom";
import { setPreviousRoute } from "@savchenko91/rc-route-constant";

function ParentComponent() {
  const location = useLocation();

  setPreviousRoute(ROUTES);

  return <div>...</div>;
}
```

## Additional features

### `getCurrent`

You can automatically set a page title

```ts
document.title = `You are on page "${getСurrent(ROUTES)?.NAME || ""}"`;
```

### `getListByRegExp`

```tsx
import { getListByRegExp } from "react-router-dom";

function Sider() {
  const routes = useMemo(
    () => getListByRegExp(ROUTES, /\/app\/([a-z-]+)$/),
    []
  );

  return (
    <ul>
      {routes.map((route) => (
        <li>
          <a className={route.LABEL} href={route.REDIRECT || route.PATH}>
            {route.ICON}
            {route.NAME}
          </a>
        </li>
      ))}
    </ul>
  );
}
```

### `getListForEveryLocation`

```tsx
import { useLocation } from "react-router-dom";
import { getListForEveryLocation } from "react-router-dom";

function Breadcrumbs() {
  const location = useLocation();

  const routes = useMemo(() =>
    getListForEveryLocation(ROUTES, location.pathname, [])
  );

  return (
    <ul>
      {routes.map((route, i) => (
        <li>
          <a href={route.REDIRECT || route.PATH}>/ {route.NAME}</a>
        </li>
      ))}
    </ul>
  );
}
```
