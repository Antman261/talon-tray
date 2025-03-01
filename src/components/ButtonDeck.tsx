import { TalonMicIcon } from "./TalonMicIcon";
import { TalonStatusIcon } from "./TalonStatusIcon";

export const ButtonDeck = () => (
  <div data-tauri-drag-region class="button-deck"><TalonStatusIcon/><TalonMicIcon/></div>
);