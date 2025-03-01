import { TalonEvent } from "./talonEvents";

const AGE_MS = 7000;
export const isRecent = (e: TalonEvent) => e.occurredAt > Date.now() - AGE_MS;