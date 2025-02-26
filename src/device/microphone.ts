import { signal } from "@preact/signals";

export const amplitude = signal(0);

let animator: number | undefined; 

export const startMicrophone = () => {
    console.log('starting microphone');
    (async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const audioContext = new AudioContext();
        const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
        const analyserNode = audioContext.createAnalyser();
        mediaStreamAudioSourceNode.connect(analyserNode);

        const pcmData = new Float32Array(analyserNode.fftSize);
        const onFrame = () => {
            analyserNode.getFloatTimeDomainData(pcmData);
            let sumSquares = 0.0;
            for (const amps of pcmData) { 
                sumSquares += amps * amps; 
            }
            amplitude.value = Math.sqrt(sumSquares/ pcmData.length);
        };
        animator = setInterval(onFrame, 32);
    })();
    return stopMicrophone;
}

export const stopMicrophone = () => {
  animator && clearInterval(animator);
}