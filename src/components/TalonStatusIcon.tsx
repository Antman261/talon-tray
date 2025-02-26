import { IconBtn } from "../elements/IconBtn";
import { useTalonDispatch } from "../hooks/useTalonDispatch";
import { state } from "../talon";

export const TalonStatusIcon = () => {
  const { status } = state.value;
  return status  === 'AWAKE' ? <AwakeIcon/> : <AsleepIcon/>;
}

const AsleepIcon = () => {
  const {toggleSpeech} = useTalonDispatch()
  return <IconBtn onClick={toggleSpeech}>Asleep...</IconBtn>
};
const AwakeIcon = () => {
  const {toggleSpeech} = useTalonDispatch()
  return <IconBtn onClick={toggleSpeech}>AWAKE</IconBtn>
};