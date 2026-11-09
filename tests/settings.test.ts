import { describe, it, expect } from 'vitest';
import { validLengthsForBase, isLengthAllowed } from '../src/game/settings';

describe('settings logic', () => {
  it('allows only length 2 for binary base', () => {
    expect(validLengthsForBase(2)).toEqual([2]);
  });

  it('allows lengths up to 6 for decimal and hex', () => {
    expect(validLengthsForBase(10)).toEqual([2, 3, 4, 5, 6]);
    expect(validLengthsForBase(16)).toEqual([2, 3, 4, 5, 6]);
  });

  it('correctly identifies if a specific length is allowed', () => {
    expect(isLengthAllowed(3, 2)).toBe(false);
    expect(isLengthAllowed(3, 8)).toBe(true);
  });
});
