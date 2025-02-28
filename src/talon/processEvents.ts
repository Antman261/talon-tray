import { talonState } from "./reducer";
import { commands, state } from "./stateManager";
import { TalonEvent, PhraseUttered } from "./talonEvents";

const AGE_MS = 7000;
const CMD_LIMIT = 10;

export const processEvents = (newEvents: TalonEvent[]): void => {
    commands.value = newEvents.reduce(talonCommands, commands.value)
      .filter(isRecent).slice(0, CMD_LIMIT);
    state.value = newEvents.reduce(talonState, state.value);
}

const talonCommands = (cmds: PhraseUttered[], e: TalonEvent) => isCommand(e) ? cmds.concat(e) : cmds;

const isCommand = (e: TalonEvent): e is PhraseUttered => e.type === 'PHRASE_UTTERED';
const isRecent = (e: TalonEvent) => e.occurredAt > Date.now() - AGE_MS;