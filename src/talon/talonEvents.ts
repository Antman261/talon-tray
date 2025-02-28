type EventBase = {occurredAt: number;}
export type PhraseUttered = { type: 'PHRASE_UTTERED', phrase: string } & EventBase;
export type MicSelected = { type: 'MIC_SELECTED'; mic: string } & EventBase
export type Awoken = { type: 'AWOKEN'; } & EventBase
export type Drowsed = { type: 'DROWSED'; } & EventBase

export type TalonEvent = PhraseUttered | MicSelected | Awoken | Drowsed;
export type EventMap = {
  PHRASE_UTTERED: PhraseUttered;
  MIC_SELECTED: MicSelected;
  AWOKEN: Awoken;
  DROWSED: Drowsed;
}
export type EventType = keyof EventMap;