import { describe, it, expect } from 'vitest';
import { createDigitValidator } from '../src/game/createDigitValidator';

describe('createDigitValidator', () => {
  it('accepts only binary digits for base 2', () => {
    const v = createDigitValidator(2);
    expect(v('0')).toBe(true);
    expect(v('1')).toBe(true);
    expect(v('2')).toBe(false);
  });

  it('accepts decimal digits for base 10', () => {
    const v = createDigitValidator(10);
    expect(v('0')).toBe(true);
    expect(v('9')).toBe(true);
    expect(v('a')).toBe(false);
  });

  it('accepts hex digits case-insensitively', () => {
    const v = createDigitValidator(16);
    expect(v('a')).toBe(true);
    expect(v('A')).toBe(true);
    expect(v('F')).toBe(true);
    expect(v('g')).toBe(false);
  });

  it('rejects multichar and empty input', () => {
    const v = createDigitValidator(10);
    expect(v('')).toBe(false);
    expect(v('12')).toBe(false);
  });
});
