import { dispatchCommand, state } from '../talon';

export const useTalonDispatch = () => ({
  toggleSpeech: () => dispatchCommand('actions.speech.toggle()'),
  toggleMic() {
    const { mic, lastMic: previousMic } = state.value;
    const isActive = mic !== 'None';
    const nextMic = isActive ? 'None' : previousMic;
    dispatchCommand(`actions.user.select_microphone("${nextMic}")`)
  }
});
