import "./App.css";
import { ButtonDeck } from "./components/ButtonDeck";
import { initTalonPolling } from "./talon/initTalonPolling";

initTalonPolling();

function App() {
  return (
    <main>  <ButtonDeck/> </main>
  );
}

export default App;
