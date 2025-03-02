import { dispatchCommand } from "./dispatchCommand";
import { memoise } from "../util/memoise";
import { initTalonEventListener, readTalonEvents } from "./readTalonEvents";
import { Func } from "../util/Func";

export const initTalonPolling = memoise(async () => {
  await dispatchCommand('actions.user.sync_talon_tray_state()');
  await readTalonEvents();
  await initTalonEventListener();
  setInterval(runTick, 35);

});

const polledFuncs = new Set<Func>();

export const onPollTick = <Fn extends Func>(fn: Fn) => polledFuncs.add(fn);
export const offPollTick = <Fn extends Func>(fn: Fn) => polledFuncs.delete(fn);

const runTick = () => {
  for (const fn of polledFuncs) { fn() }
}