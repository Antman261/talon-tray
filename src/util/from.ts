type Mapper = (item: any) => any;
type Operation<T> = RemoveOp<T> | AddOp<T> | MapOp;
type AddOp<T> = { kind: 'add'; args: T[] };
type RemoveOp<T> = { kind: 'remove'; args: T[] };
type MapOp = { kind: 'map'; args: Mapper[] };
type OpSet<T> = { add?: AddOp<T>; remove?: RemoveOp<T>; map?: MapOp };
type Plan<T> = OpSet<T>[];
type OpFn<T> = (a: T[] | undefined, i: number) => unknown;
type Operator<T> = { add: OpFn<T>; remove: OpFn<T>; map: OpFn<Mapper> };

export const from = <T>(arr: T[], copy = false) => {
  const target = copy ? [...arr] : arr;
  const ops: Operation<T>[] = [];
  return {
    remove(...args: T[]) {
      ops.push(makeRemoveOp(args));
      return this;
    },
    add(...args: T[]) {
      ops.push(makeAddOp(args));
      return this;
    },
    map(arg: Mapper) {
      const op = ops.at(-1);
      op?.kind === 'map' ? op.args.push(arg) : ops.push(makeMapOp(arg));
      return this;
    },
    result() {
      const isNoop = target.length === 0 || ops.length === 0;
      if (isNoop) return target;
      const operator = getOperator(target);
      const plan = generatePlan(ops);
      for (let stepIdx = 0; stepIdx < plan.length; stepIdx++) {
        const step = plan[stepIdx];
        operator.add(step.add?.args, 0);
        if (step.remove || step.map) {
          const remover = (i: number) => operator.remove(step.remove?.args, i);
          const mapper = (i: number) => operator.map(step.map?.args, i);
          const operate = (i: number) => remover(i) || mapper(i);
          for (let i = target.length - 1; i > -1; i--) operate(i);
        }
      }
      return target;
    },
  };
};

export const fromCopyOf = <T>(arr: T[]) => from(arr, true);

const makeMapOp = (arg: Mapper): MapOp => ({ kind: 'map', args: [arg] });
const makeAddOp = <T>(args: T[]): AddOp<T> => ({ kind: 'add', args });
const makeRemoveOp = <T>(args: T[]): RemoveOp<T> => ({ kind: 'remove', args });

function getOperator<T>(ar: T[]): Operator<T> {
  const mappers = new Map<Mapper[], Mapper>();
  return {
    add: (args) => ar.push(...(args ?? [])),
    remove: (args, i) => args?.includes(ar[i]) && ar.splice(i, 1).length,
    map(args, idx) {
      if (args === undefined) return;
      let mapper =
        mappers.get(args) ??
        args.reduce(
          // TODO: optimize
          (p, c) => (i) => c(p(i)),
          (i) => i
        );
      mappers.set(args, mapper);
      ar[idx] = mapper(ar[idx]);
    },
  };
}

function generatePlan<T>(ops: Operation<T>[]): Plan<T> {
  const plan: Plan<T> = [{}];
  for (let i = 0; i < ops.length; ++i) {
    const op = ops[i];
    const opSet = plan.at(-1)!;
    if (op.kind === 'add')
      opSet.add ? opSet.add.args.push(...op.args) : (opSet.add = op);
    if (op.kind === 'remove')
      opSet.remove ? opSet.remove.args.push(...op.args) : (opSet.remove = op);
    if (op.kind === 'map') {
      opSet.map = op;
      i < ops.length - 1 && plan.push({});
    }
  }
  return plan;
}
