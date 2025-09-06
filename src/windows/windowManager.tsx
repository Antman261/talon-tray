import { window } from '@tauri-apps/api';
import { PhysicalPosition } from '@tauri-apps/api/window';

let hasInIt = false;

export const windowManager = {
  async init() {
    if (hasInIt) return;
    hasInIt = true;
    const win = window.getCurrentWindow();
    const otherWins = await window.getAllWindows();
    const commandsWindow = otherWins.find((w) => w.label === 'commands');
    if (!commandsWindow) return;
    win.onResized(async (e) => {
      const width = e.payload.width;
      const pos = await win.outerPosition();
      const cmdWinPos = await commandsWindow.outerPosition();
      const oldSize = await commandsWindow?.innerSize();
      oldSize.width = width;
      await commandsWindow.setSize(oldSize);
      const newPosition = new PhysicalPosition(pos.x, cmdWinPos.y);
      await commandsWindow.setPosition(newPosition);
    });
  },
};
