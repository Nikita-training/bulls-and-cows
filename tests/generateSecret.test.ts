import { describe, it, expect } from 'vitest';
import { generateSecret } from '../src/game/generateSecret';

const seq = (values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};

describe('generateSecret', () => {
  it('creates a secret with the correct length', () => {
    expect(generateSecret(4, 10, seq([0.1, 0.2, 0.3, 0.4]))).toHaveLength(4);
  });

  it('creates only unique (different) digits', () => {
    const secret = generateSecret(6, 16);
    expect(new Set(secret).size).toBe(6);
  });

  it('gives the exact same result if random is the same', () => {
    const r = () => 0;
    expect(generateSecret(3, 10, r)).toBe('012');
    expect(generateSecret(3, 10, r)).toBe('012');
  });

  it('uses only digits from the chosen base', () => {
    const secret = generateSecret(2, 2);
    expect(secret).toMatch(/^[01]{2}$/);
  });

  it('can start with zero', () => {
    expect(generateSecret(3, 10, () => 0)).toBe('012');
  });
});
