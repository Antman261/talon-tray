import { computed, signal } from '@preact/signals';
import { fromCopyOf } from '../util/from';

export type TalonState = {
  lastMic?: string;
  mic: string;
  status: 'ASLEEP' | 'AWAKE';
  modes: string[];
};

export const state = signal<TalonState>({
  mic: '',
  status: 'AWAKE',
  modes: [],
});
export const isMicActive = computed(() => state.value.mic !== 'None');
export const isStreamMode = computed(() =>
  state.value.modes.includes('user.stream')
);
export const isAwake = computed(() => state.value.status === 'AWAKE');
export const modes = computed(() => {
  const calcModes = fromCopyOf(state.value.modes).remove('sleep', 'command');
  if (_isMixedMode()) calcModes.remove('dictation').add('mixed');
  return calcModes.map(toModeName).result();
});
const _isMixedMode = () =>
  state.value.modes.includes('dictation') &&
  state.value.modes.includes('command');
export const isMixedMode = computed(_isMixedMode);

const toModeName = (name: string): string =>
  name.replace('user.', '').replace('_mode', '').toUpperCase();
