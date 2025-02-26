import "./App.css";
import { CommandHistory } from "./components/CommandHistory";
import { ButtonDeck } from "./components/ButtonDeck";
import { initTalonPolling } from "./talon/initTalonPolling";

initTalonPolling();


function App() {
  return (
    <main>
      <CommandHistory/>
      <ButtonDeck/>
    </main>
  );
}

export default App;
