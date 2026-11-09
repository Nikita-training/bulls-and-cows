import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addRecord, loadRecords } from '../src/game/records';

const store: Record<string, string> = {};

const mockLocalStorage = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => {
    store[key] = value;
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    Object.keys(store).forEach((k) => delete store[k]);
  },
  length: 0,
  key: () => null,
} as Storage;

vi.stubGlobal('localStorage', mockLocalStorage);

describe('records logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty and saves a record', () => {
    expect(loadRecords()).toEqual([]);
    addRecord({ length: 4, base: 10, attempts: 5, timeMs: 30000, date: '2026-11-09' });
    expect(loadRecords().length).toBe(1);
  });

  it('sorts by attempts, then by time', () => {
    addRecord({ length: 4, base: 10, attempts: 5, timeMs: 10000, date: '2026-11-09' });
    addRecord({ length: 4, base: 10, attempts: 3, timeMs: 20000, date: '2026-11-09' });
    const records = loadRecords();
    expect(records[0].attempts).toBe(3);
  });

  it('keeps only top 10', () => {
    for (let i = 1; i <= 12; i++) {
      addRecord({ length: 4, base: 10, attempts: i, timeMs: 1000, date: '2026-11-09' });
    }
    expect(loadRecords().length).toBe(10);
  });
});
