import { Base } from './types';

const DIGITS_BY_BASE: Record<Base, string> = {
  2: '01',
  8: '01234567',
  10: '0123456789',
  16: '0123456789abcdef',
};

export function generateSecret(
  length: number,
  base: Base,
  random: () => number = Math.random,
): string {
  const pool: string[] = [...DIGITS_BY_BASE[base]];

  const arrayToLoop = Array.from({ length }, (_, index) => index);

  const result = arrayToLoop.reduce<{
    remaining: string[];
    picked: string;
  }>(
    (accumulator) => {
      const randomNumber = random();
      const randomIndex = Math.floor(randomNumber * accumulator.remaining.length);

      const chosenCharacter = accumulator.remaining[randomIndex];

      return {
        remaining: accumulator.remaining.filter((_, index) => index !== randomIndex),
        picked: accumulator.picked + chosenCharacter,
      };
    },
    { remaining: pool, picked: '' },
  );

  return result.picked;
}
