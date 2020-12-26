import { Action } from "./api.d";

export function combine(initS: any, ...fn: ((s: any, a: Action) => any)[]) {
  return (s = initS, a: Action): any => {
    for (let i = 0; i < fn.length; i += 1) {
      const newState = fn[i](s, a);
      if (newState) return newState;
    }

    return s;
  };
}
