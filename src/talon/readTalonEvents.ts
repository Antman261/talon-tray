import { BaseDirectory, readDir, readTextFile, DirEntry, remove, watchImmediate, WatchEvent, WatchEventKindCreate } from "@tauri-apps/plugin-fs";
import { TalonEvent } from "./talonEvents";
import { processEvents } from "./processEvents";

type CreateFile = { create?: WatchEventKindCreate };

const talonEventsDir = 'talon-tray/talon-events';
const tempDirOpt = { baseDir: BaseDirectory.Temp }
const mockFilesCreated: Omit<WatchEvent, 'paths'> = { type: { create: { kind: 'file' }}, attrs: null };

export const readTalonEvents = async () => onFileEvent(toFileEvent(await scanEventFolder()));

const kinds: (string | undefined)[] = ['any', 'file', 'other'];
const isCreatedEvent = ({type}: WatchEvent) => kinds.includes((<CreateFile>type).create?.kind);

const onFileEvent = async (fileEvent: WatchEvent) => {
  if (isCreatedEvent(fileEvent) === false) return;
  const events = await loadEventsFromDisk(fileEvent.paths);
  deleteEventFiles(fileEvent.paths);
  processEvents(events);
}

export const initTalonEventListener = async () => {
  await watchImmediate(talonEventsDir, onFileEvent, tempDirOpt)
}

const scanEventFolder = async () => (await readDir(talonEventsDir, tempDirOpt)).map(toPath);
const loadEventsFromDisk = async (paths: string[]) => {
    const results = await Promise.all(paths.filter(hasJsonExt).map(toEvent));
    return results.filter(isEvent).sort(byTime);
}
const deleteEventFiles = (paths: string[]) => Promise.allSettled(paths.map(deleteFile));

const toEvent = async (path: string): Promise<TalonEvent | undefined> => {
  try {
    return JSON.parse((await readTextFile(path, tempDirOpt)).trim());
  } catch(error) {
    if (error?.toString().includes('not exist')) return;
    console.error('Error parsing talon event:', { error, path });
  }
};

const hasJsonExt = (p: string) => p.endsWith('.json');
const byTime = (a: TalonEvent, b: TalonEvent) => a.occurredAt - b.occurredAt;
const toPath = (d: DirEntry) => `${talonEventsDir}/${d.name}`;
const isEvent = (e: TalonEvent | undefined): e is TalonEvent => !!e?.type;
const deleteFile = (p: string) => remove(p, tempDirOpt);
const toFileEvent = (paths: string[]) => ({ ...mockFilesCreated, paths })
