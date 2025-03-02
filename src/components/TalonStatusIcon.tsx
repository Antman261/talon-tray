import { IconBtn } from "../elements/IconBtn";
import { OnOffBtn } from "../elements/OnOffBtn";
import { useTalonDispatch } from "../hooks/useTalonDispatch";
import { state } from "../talon";

export const TalonStatusIcon = () => {
  const {toggleSpeech} = useTalonDispatch()
  const { status } = state.value;
  const isAwake = status  === 'AWAKE';
  return <OnOffBtn onClick={toggleSpeech} on={isAwake}>{isAwake ? 'On' : 'Off'}</OnOffBtn>
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