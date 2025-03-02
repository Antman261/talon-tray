import { signal } from "@preact/signals";
import { memoise } from "../util";
import { offPollTick, onPollTick, state } from "../talon";
import { onEvent } from "../talon/reducer";

export const amplitude = signal(0);

export const startMetering = async () => onPollTick(await configureMicrophone());
export const stopMetering = async () => offPollTick(await configureMicrophone());

const configureMicrophone = memoise(async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  console.log('tracks:', stream.getTracks().map((t) => t.label));
  console.log('mic:', state.value.mic)
  const tracks = stream.getTracks().filter((track) => track.label !== state.value.mic);
  tracks.forEach(stream.removeTrack);
  const audioContext = new AudioContext();
  const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
  const analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 32;
  analyserNode.maxDecibels = 0;
  mediaStreamAudioSourceNode.connect(analyserNode);

  const bufferLength = analyserNode.frequencyBinCount;
  const calcAvgAmplitude = avgAmplitude(bufferLength);
  const data = new Uint8Array(bufferLength);
  return () => {
    analyserNode.getByteFrequencyData(data);
    amplitude.value = calcAvgAmplitude(data);
  };
});

onEvent('MIC_SELECTED', ({ mic }) => mic === 'None' ? stopMetering() : startMetering());

const max8Bit = 255;
const avgAmplitude = (bufferLength: number) => {
  let max = 0;
  for (let i = 0; i < bufferLength; i++) { max += weighLowFreqs(max8Bit, i); }
  max = max / 2;
  return (data: Uint8Array): number => {
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) { sum += weighLowFreqs(data[i], i); }
    const amplitude = sum / max;
    return amplitude > 0.16 ? amplitude : 0
  }
}
const weighLowFreqs = (amp: number, freqBinIdx: number) => amp / (freqBinIdx === 0 ? 10 : freqBinIdx + 1);