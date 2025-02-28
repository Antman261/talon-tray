import { signal } from "@preact/signals";
import { memoise } from "../util";
import { offPollTick, onPollTick } from "../talon";
import { onEvent } from "../talon/reducer";

export const amplitude = signal(0);

export const startMetering = async () => onPollTick(await configureMicrophone());
export const stopMetering = async () => offPollTick(await configureMicrophone());

const configureMicrophone = memoise(async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
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

const max8Byte = 255;
const avgAmplitude = (bufferLength: number) => {
  const max = (bufferLength / 2) * max8Byte;
  return (data: Uint8Array): number => {
    let sum = 0;
    for (let i = 0; i < bufferLength / 2; i++) { sum += data[i]; }
    return sum / max
  }
}
// const rootMeanSquare = (pcmData: Float32Array): number => {
//   let sumSquares = 0.0;
//   for (const amps of pcmData) { sumSquares += amps * amps; }
//   return Math.sqrt(sumSquares / pcmData.length) * 5;
// };