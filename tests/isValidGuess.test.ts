import { describe, it, expect } from 'vitest';
import { isValidGuess } from '../src/game/isValidGuess';

describe('isValidGuess', () => {
  it('accepts valid guess', () => {
    expect(isValidGuess('0123', 4, 10)).toBe(true);
  });

  it('rejects wrong length', () => {
    expect(isValidGuess('012', 4, 10)).toBe(false);
    expect(isValidGuess('01234', 4, 10)).toBe(false);
  });

  it('rejects digits outside the base', () => {
    expect(isValidGuess('0122', 4, 2)).toBe(false);
    expect(isValidGuess('0999', 4, 8)).toBe(false);
  });

  it('rejects duplicate digits', () => {
    expect(isValidGuess('1122', 4, 10)).toBe(false);
  });

  it('accepts hex uppercase and rejects mixed-case duplicates', () => {
    expect(isValidGuess('ABcd', 4, 16)).toBe(true);
    expect(isValidGuess('Aa12', 4, 16)).toBe(false);
  });
});
