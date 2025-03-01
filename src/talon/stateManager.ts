import { Signal, signal } from "@preact/signals";
import { PhraseUttered } from "./talonEvents";

export type TalonState = {
    lastMic?: string;
    mic: string;
    status: 'ASLEEP' | 'AWAKE';
}
export type TalonContext = { state: Signal<TalonState>, commands: Signal<PhraseUttered[]> };

export const state = signal<TalonState>({ mic: '', status: 'AWAKE' });
export const getContext = () => ({ state });

