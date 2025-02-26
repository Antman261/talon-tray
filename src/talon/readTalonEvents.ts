import { BaseDirectory, readDir, readTextFile, DirEntry, remove } from "@tauri-apps/plugin-fs";
import { TalonEvent } from "./talonEvents";
import { processEvents } from "./processEvents";

const talonEventsDir = 'talon-tray/talon-events';
const tempDirOpt = { baseDir: BaseDirectory.Temp }

export const readTalonEvents = async () => {
  const paths = await scanEventDirectory();
  const events = await loadEventsFromDisk(paths);
  deleteEventFiles(paths);
  processEvents(events);
}

const scanEventDirectory = async () => (await readDir(talonEventsDir, tempDirOpt)).map(toPath);
const loadEventsFromDisk = async (paths: string[]) => {
    const results = await Promise.all(paths.filter(hasJsonExt).map(toEvent));
    return results.filter(isEvent).sort(byTime);
}
const deleteEventFiles = (paths: string[]) => Promise.allSettled(paths.map(deleteFile));

const toEvent = async (path: string): Promise<TalonEvent | undefined> => {
  try {
    return JSON.parse((await readTextFile(path, tempDirOpt)).trim());
  } catch(error) {
    console.error('Error parsing talon event:', { error, path });
  }
};

const hasJsonExt = (p: string) => p.endsWith('.json');
const byTime = (a: TalonEvent, b: TalonEvent) => a.occurredAt - b.occurredAt;
const toPath = (d: DirEntry) => `${talonEventsDir}/${d.name}`;
const isEvent = (e: TalonEvent | undefined): e is TalonEvent => !!e?.type;
const deleteFile = (p: string) => remove(p, tempDirOpt);
