import { describe, it, expect } from 'vitest';
import { evaluateGuess } from '../src/game/evaluateGuess';

describe('evaluateGuess', () => {
  it('counts all bulls if the guess is exactly the secret', () => {
    expect(evaluateGuess('0123', '0123')).toEqual({ bulls: 4, cows: 0 });
  });

  it('counts all cows if the digits are in the wrong positions', () => {
    expect(evaluateGuess('0123', '3210')).toEqual({ bulls: 0, cows: 4 });
  });

  it('counts mixed bulls and cows correctly', () => {
    expect(evaluateGuess('0123', '0214')).toEqual({ bulls: 1, cows: 2 });
  });

  it('counts zero bulls and zero cows if nothing matches', () => {
    expect(evaluateGuess('0123', '4567')).toEqual({ bulls: 0, cows: 0 });
  });

  it('ignores letter case for hex numbers', () => {
    expect(evaluateGuess('abcd', 'ABCD')).toEqual({ bulls: 4, cows: 0 });
    expect(evaluateGuess('abcd', 'badc')).toEqual({ bulls: 0, cows: 4 });
  });
});
