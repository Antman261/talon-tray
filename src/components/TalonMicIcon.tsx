import "./micIcon.css";
import { amplitude } from "../device/microphone";
import { IconBtn } from "../elements/IconBtn";
import { useTalonDispatch } from "../hooks/useTalonDispatch";
import { state } from "../talon";

export const TalonMicIcon = () => {
  const { mic } = state.value;
  const isActive = mic  === 'None';
  return isActive ? <MicOffIcon/> : <MicOnIcon/>;
}

const MicOnIcon = () => {
  const { toggleMic } = useTalonDispatch();
  const amp = amplitude.value;
  console.log(amp)
  return (
    <div onClick={toggleMic} class="mic-meter">
      {<div class="meter-outer"><div class="meter-inner" style={`transform: scale(${amp})`}/></div>}
    </div>
  )
};
const MicOffIcon = () => {
  const { toggleMic } = useTalonDispatch();
  return <IconBtn onClick={toggleMic}>MIC OFF</IconBtn>
};