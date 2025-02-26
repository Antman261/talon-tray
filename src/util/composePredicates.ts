import { TalonEvent } from "../talon/talonEvents";

type EventPredicate = (e: TalonEvent) => boolean;

export const composePredicates = (...fns: EventPredicate[]) => (e: TalonEvent) => fns.every((fn) => fn(e));