import "./micIcon.css";
import { amplitude } from "../../device/microphone";
import { IconBtn } from "../../elements/IconBtn";
import { useTalonDispatch } from "../../hooks/useTalonDispatch";
import { state } from "../../talon";

export const TalonMicIcon = () => {
  const { mic } = state.value;
  const isActive = mic  === 'None';
  return isActive ? <MicOffIcon/> : <MicOnIcon/>;
}
const toHsla = (amp: number) => `hsla(${135 - (amp * 100)}, 94%, 79%, 0.9)`
const toStyle = (amp: number) => 
  `transform: scale(${amp});
   background: ${toHsla(amp)};
   box-shadow: 0 0 ${amp*20}px ${toHsla(amp)};`

const MicOnIcon = () => {
  const { toggleMic } = useTalonDispatch();
  return (
    <div onClick={toggleMic} class="mic-meter">
      <div class="meter-outer">
        <div class="meter-inner" style={toStyle(amplitude.value)}/>
        </div>
    </div>
  )
};
const MicOffIcon = () => {
  const { toggleMic } = useTalonDispatch();
  return <IconBtn onClick={toggleMic}>MIC OFF</IconBtn>
};