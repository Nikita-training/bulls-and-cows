import { Base } from './types';

const DIGITS_BY_BASE: Record<Base, string> = {
  2: '01',
  8: '01234567',
  10: '0123456789',
  16: '0123456789abcdef',
};

export function createDigitValidator(base: Base) {
  return function isDigit(char: string): boolean {
    if (char.length !== 1) {
      return false;
    }

    const allowedChars = DIGITS_BY_BASE[base];
    const normalizedChar = char.toLowerCase();

    return allowedChars.includes(normalizedChar);
  };
}
