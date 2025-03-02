import "./ButtonDeck.css"
import { TalonMicIcon } from "../../components/MicMeter/TalonMicIcon";
import { TalonStatusIcon } from "../../components/TalonStatusIcon";

export const ButtonDeck = () => (
  <div data-tauri-drag-region class="button-deck"><TalonStatusIcon/><TalonMicIcon/></div>
);