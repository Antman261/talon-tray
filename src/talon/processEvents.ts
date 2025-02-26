import { isWeakNever, withDebugLogging } from "../util";
import { commands, state, TalonState } from "./stateManager";
import { TalonEvent, PhraseUttered } from "./talonEvents";

const MAX_AGE_MS = 7000;
const CMD_LIMIT = 10;

export const processEvents = (newEvents: TalonEvent[]): void => {
    const cmds = [...commands.value, ...newEvents.filter(isCommand)];
    const idx = cmds.findIndex(isRecent(MAX_AGE_MS));
    commands.value = idx  === -1 ? [] : cmds.slice(idx, CMD_LIMIT);
    state.value = newEvents.reduce(reduceTalonState, state.value);
}

const reduceTalonState = withDebugLogging((state: TalonState, event: TalonEvent): TalonState => {
    const { type } = event;
    switch (type) {
        case 'MIC_SELECTED':
            const previousMic = event.mic !== 'None' ? event.mic : state.previousMic;
            return { ...state, mic: event.mic, previousMic };
        case 'DROWSED': 
            return { ...state, status: 'ASLEEP' };
        case 'AWOKEN':
            return { ...state, status: 'AWAKE' };
        case 'PHRASE_UTTERED':
            return state;
        default: 
             isWeakNever(type);
    }
    return state;
}, 'reduceTalonState')

const isCommand = (e: TalonEvent): e is PhraseUttered => e.type === 'PHRASE_UTTERED';
const isRecent = (ms: number) => (e: PhraseUttered) => e.occurredAt > Date.now() - ms;