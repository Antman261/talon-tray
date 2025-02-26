import { dispatchCommand } from "./dispatchCommand";
import { memoise } from "../util/memoise";
import { readTalonEvents } from "./readTalonEvents";

export const initTalonPolling = memoise(() => {
  dispatchCommand('actions.user.sync_talon_tray_state()');
  setInterval(readTalonEvents, 50);
});
