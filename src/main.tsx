import { render } from "preact";
import { ButtonDeck } from "./windows/ButtonDeck";
import { initTalonPolling } from "./talon";

render(<ButtonDeck />, document.getElementById("root")!);

initTalonPolling();
