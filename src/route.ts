export type Routes = { [key: string]: Route };

export type AdditionalProps = {
  readonly ICON?: JSX.Element;
  readonly LABEL?: string;
  readonly REDIRECT?: string;
};

export type MandateProps = {
  readonly PATH: string;
  readonly NAME: string;
};

export type RouteProps = MandateProps & AdditionalProps;

export class Route implements RouteProps {
  readonly NAME: string;

  readonly PATH: string;

  readonly REDIRECT?: string;

  readonly LABEL?: string;

  readonly ICON?: JSX.Element;

  isPrevious: boolean;

  constructor(
    name: MandateProps["NAME"],
    path: MandateProps["PATH"],
    additionalProps?: AdditionalProps
  ) {
    this.NAME = name;
    this.PATH = path;

    this.ICON = additionalProps?.ICON;
    this.LABEL = additionalProps?.LABEL;
    this.REDIRECT = additionalProps?.REDIRECT;

    this.isPrevious = false;
  }

  get isCurrent(): boolean {
    return buildPathRegExp(this.PATH, true).test(window?.location?.pathname);
  }

  isPartOf = (path?: string): boolean => {
    return buildPathRegExp(this.PATH).test(path || window.location.pathname);
  };

  static new(
    name: MandateProps["NAME"],
    path: MandateProps["PATH"],
    additionalProps?: AdditionalProps
  ) {
    return new Route(name, path, additionalProps);
  }
}

function buildPathRegExp(path: string, end?: boolean): RegExp {
  return new RegExp(
    `${path.replace(/:(.)+\//, `(.)+/`).replace(/:(.)+/, `(.)+`)}${
      end ? "$" : ""
    }`
  );
}
