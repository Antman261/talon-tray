import "./micIcon.css";
import { amplitude, startMicrophone } from "../device/microphone";
import { IconBtn } from "../elements/IconBtn";
import { useTalonDispatch } from "../hooks/useTalonDispatch";
import { state } from "../talon";

export const TalonMicIcon = () => {
  const { mic } = state.value;
  const isActive = mic  === 'None';
  return isActive ? <MicOffIcon/> : <MicOnIcon/>;
}

startMicrophone();

const MicOnIcon = () => {
  const { toggleMic } = useTalonDispatch();
  const amp = amplitude.value * 1000;
  return (
    <div onClick={toggleMic} class="mic-meter">
      <div class="meter-outer"><div class="meter-inner" style={`width: ${amp}%; height: ${amp}%`}/></div>
    </div>
  )
};
const MicOffIcon = () => {
  const { toggleMic } = useTalonDispatch();
  return <IconBtn onClick={toggleMic}>MIC OFF</IconBtn>
};
// <meter min="0" max="100" low={20} high={95} optimum={60} value={amplitude.value * 1000}/>