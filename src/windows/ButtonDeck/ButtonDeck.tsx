import './ButtonDeck.css';
import { toClass } from '../../util';
import { isAwake, isMixedMode } from '../../talon';
import { TalonMicIcon } from '../../components/MicMeter/TalonMicIcon';
import { TalonStatusIcon } from '../../components/TalonStatusIcon';
import { TalonModeIcons } from '../../components/TalonModeIcons';
import { VerticalBar } from '../../elements/VerticalBar';

export const ButtonDeck = () => {
  const classes = toClass(
    'button-deck',
    isAwake.value ? '' : 'bg-off',
    isMixedMode.value ? 'bg-warn' : ''
  );
  return (
    <div data-tauri-drag-region class={classes}>
      <TalonModeIcons />
      <VerticalBar />
      <TalonMicIcon />
      <TalonStatusIcon />
    </div>
  );
};
