import { render } from 'preact';
import { ButtonDeck } from './windows/ButtonDeck';
import { initTalonPolling } from './talon';
import { windowManager } from './windows/windowManager';

render(<ButtonDeck />, document.getElementById('root')!);

initTalonPolling();
windowManager.init();
