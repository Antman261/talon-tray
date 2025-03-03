import "./micIcon.css";
import { amplitude } from "../../device/microphone";
import { useTalonDispatch } from "../../hooks/useTalonDispatch";
import { state } from "../../talon";
import { OnOffBtn } from "../../elements/OnOffBtn";
import { FunctionComponent } from "preact";
import { toClass } from "../../util";

export const TalonMicIcon = () => {
  const { mic } = state.value;
  const isActive = mic !== 'None';
  return (
    <div class="mic-icon-wrapper">
      <MicOffIcon isVisible={!isActive} />
      <MicOnIcon isVisible={isActive} />
    </div>
  );
}
const toHsla = (amp: number) => `hsla(${135 - (amp * 100)}, 94%, 79%, 0.9)`
const toStyle = (amp: number) => 
  `transform: scale(${amp});
   background: ${toHsla(amp)};
   box-shadow: 0 0 ${amp*20}px ${toHsla(amp)};`

type Props = { isVisible: boolean };
const MicOnIcon: FunctionComponent<Props> = ({isVisible}) => {
  const { toggleMic } = useTalonDispatch();
  const classes = toClass('mic-icon', 'mic-meter', isVisible ? '' : 'hidden')
  return (
    <div onClick={toggleMic} class={classes}>
      <div class="meter-outer">
        <div class="meter-inner" style={toStyle(amplitude.value)}/>
        </div>
    </div>
  )
};


const MicOffIcon: FunctionComponent<Props> = ({isVisible}) => {
  const { toggleMic } = useTalonDispatch();
  const classes = toClass('mic-icon', isVisible ? '' : 'hidden');
  return <OnOffBtn 
            onClick={toggleMic} 
            on={false} 
            class={classes}
            icon="Mic"/>
};