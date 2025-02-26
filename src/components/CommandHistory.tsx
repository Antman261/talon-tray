import { commands, PhraseUttered } from "../talon";

export const CommandHistory = () => (
  <div class="command-history">
    {commands.value.map(CommandHistoryItem)}
  </div>
);

const CommandHistoryItem = (p: PhraseUttered) => <div className="command">{p.phrase}</div>;
