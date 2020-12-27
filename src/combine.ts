export function combine(initS: any, ...fn: ((s: any, a: any) => any)[]) {
  return (s = initS, a: any): any => {
    for (let i = 0; i < fn.length; i += 1) {
      const newState = fn[i](s, a);
      if (newState) return newState;
    }

    return s;
  };
}
