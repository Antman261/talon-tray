import { getCurrentWebview } from '@tauri-apps/api/webview';
import { talonState } from "./reducer";
import { state } from "./stateManager";
import { TalonEvent, PhraseUttered } from "./talonEvents";
import { isRecent } from './isRecent';

const webview = getCurrentWebview();
const events: TalonEvent[] = [];

export const processEvents = (newEvents: TalonEvent[]): void => {
    events.splice(0);
    for (const event of newEvents) {
        if (isRecent(event) === false) continue;
        if (isCommand(event)) {
            webview.emitTo('commands', 'PHRASE_UTTERED', event)
            continue;
        }
        events.push(event);
    }
    state.value = events.reduce(talonState, state.value);
}

const isCommand = (e: TalonEvent): e is PhraseUttered => e.type === 'PHRASE_UTTERED';