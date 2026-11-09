import { RecordEntry } from './types';

const STORAGE_KEY = 'bulls-and-cows-records';
const TOP_N = 10;

function getStoredRecords(): RecordEntry[] {
  try {
    const rawString = localStorage.getItem(STORAGE_KEY);
    if (!rawString) return [];

    const parsedData = JSON.parse(rawString);
    return Array.isArray(parsedData) ? (parsedData as RecordEntry[]) : [];
  } catch {
    return [];
  }
}

export function loadRecords(): RecordEntry[] {
  return getStoredRecords();
}

function compareRecords(a: RecordEntry, b: RecordEntry): number {
  if (a.attempts !== b.attempts) {
    return a.attempts - b.attempts;
  }
  return a.timeMs - b.timeMs;
}

export function addRecord(newRecord: RecordEntry): RecordEntry[] {
  const allRecords = [...getStoredRecords(), newRecord];

  const sortedRecords = [...allRecords].sort(compareRecords);

  const topRecords = sortedRecords.slice(0, TOP_N);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(topRecords));
  } catch {}

  return topRecords;
}
