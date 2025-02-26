type Func = (...args: never) => unknown;

const debug = false;

export const withDebugLogging = <Fn extends Func>(fn: Fn, name?: string): Fn => (((...args) => {
  const fnName = name ?? fn.name;
  debug && console.log(`fn->${fnName}->args:`, args);
  const result =  fn(...args)
  debug && console.log(`fn->${fnName}->result:`, result);
  return result;
}) as Fn);