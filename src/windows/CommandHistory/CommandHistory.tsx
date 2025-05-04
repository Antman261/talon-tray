import './CommandHistory.css';
import { signal } from '@preact/signals';
import { Notified, PhraseUttered } from '../../talon';
import { listen } from '@tauri-apps/api/event';
import { isRecent } from '../../talon/isRecent';
import { JSX } from 'preact/jsx-runtime';
import { OfType } from '../../util';

type HistoryEvent = PhraseUttered | Notified;

const commands = signal<HistoryEvent[]>([]);

listen<HistoryEvent>(
  'ENTRY_ADDED',
  ({ payload }) => (commands.value = commands.value.concat(payload))
);

setInterval(
  () =>
    commands.value.length && (commands.value = commands.value.filter(isRecent)),
  1000
);

export const CommandHistory = () => (
  <div class="command-history">{commands.value.map(CommandHistoryItem)}</div>
);

type TypeElements = {
  [k in HistoryEvent['type']]: (e: OfType<HistoryEvent, k>) => JSX.Element;
};
const entryElements = {
  PHRASE_UTTERED: (e) => <div className="entry command">{e.phrase}</div>,
  NOTIFIED: (e) => <div className={`entry notify-${e.kind}`}>{e.msg}</div>,
} as const satisfies TypeElements;

const CommandHistoryItem = <E extends HistoryEvent>(e: E) =>
  // @ts-expect-error ? shrug
  entryElements[e.type](e);
