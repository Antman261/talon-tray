import "./CommandHistory.css";

import { signal } from "@preact/signals";
import { PhraseUttered } from "../../talon";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { isRecent } from "../../talon/isRecent";

export const commands = signal<PhraseUttered[]>([]);

const webview = getCurrentWebview();
webview.listen<PhraseUttered>('PHRASE_UTTERED', ({ payload }) => {
  commands.value = commands.value.concat(payload);
});

setInterval(() => commands.value = commands.value.filter(isRecent), 1000)

export const CommandHistory = () => (
  <div class="command-history">
    {commands.value.map(CommandHistoryItem)}
  </div>
);

const CommandHistoryItem = (p: PhraseUttered) => <div className="command">{p.phrase}</div>;
