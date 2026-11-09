import { describe, it, expect } from 'vitest';
import { countPossibleSecrets } from '../src/game/countPossibleSecrets';

describe('countPossibleSecrets', () => {
  it('returns 1 if length is 0', () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
  });

  it('returns the base itself if length is 1', () => {
    expect(countPossibleSecrets(1, 10)).toBe(10);
  });

  it('calculates correctly for length 4 and base 10', () => {
    expect(countPossibleSecrets(4, 10)).toBe(5040);
  });

  it('calculates correctly for length 6 and base 16', () => {
    expect(countPossibleSecrets(6, 16)).toBe(16 * 15 * 14 * 13 * 12 * 11);
  });

  it('returns 0 if length is greater than base', () => {
    expect(countPossibleSecrets(3, 2)).toBe(0);
  });

  it('is memoized and very fast on repeat calls', () => {
    const start = performance.now();

    for (let i = 0; i < 100000; i++) {
      countPossibleSecrets(6, 16);
    }

    const end = performance.now();
    expect(end - start).toBeLessThan(50);
  });
});
