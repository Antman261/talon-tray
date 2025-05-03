import { listen } from '@tauri-apps/api/event';
import { state } from './stateManager';
import { talonState } from './reducer';
import { getCurrentWebview } from '@tauri-apps/api/webview';
import { PhraseUttered, TalonEvent } from './talonEvents';

const webview = getCurrentWebview();
const emitEvent = (event: TalonEvent) =>
  webview.emitTo('commands', 'PHRASE_UTTERED', event);
const isCommand = (e: TalonEvent): e is PhraseUttered =>
  e.type === 'PHRASE_UTTERED';

export const initSocketListener = () => {
  listen<string>('talon-event', (e) => {
    if (e.event === 'talon-event') {
      const event = JSON.parse(e.payload);
      isCommand(event) && emitEvent(event);
      state.value = talonState(state.value, event);
    }
  });
};
