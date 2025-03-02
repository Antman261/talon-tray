import { signal } from "@preact/signals";

export type TalonState = {
    lastMic?: string;
    mic: string;
    status: 'ASLEEP' | 'AWAKE';
}

export const state = signal<TalonState>({ mic: '', status: 'AWAKE' });

