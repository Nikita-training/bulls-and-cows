import { Base } from './types';

export const AVAILABLE_BASES: { label: string; base: Base }[] = [
  { label: 'bin', base: 2 },
  { label: 'oct', base: 8 },
  { label: 'dec', base: 10 },
  { label: 'hex', base: 16 },
];

export const LENGTHS = [2, 3, 4, 5, 6];

export const isLengthAllowed = (length: number, base: Base): boolean => {
  return length <= base;
};

export const validLengthsForBase = (base: Base): number[] => {
  return LENGTHS.filter((length) => isLengthAllowed(length, base));
};
