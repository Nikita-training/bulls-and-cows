const cache = new Map<string, number>();

export function countPossibleSecrets(length: number, base: number): number {
  const key = `${length}:${base}`;

  const cachedResult = cache.get(key);
  if (cachedResult !== undefined) {
    return cachedResult;
  }

  let result = 0;

  if (length === 0) {
    result = 1;
  } else if (length > base) {
    result = 0;
  } else {
    result = base * countPossibleSecrets(length - 1, base - 1);
  }

  cache.set(key, result);

  return result;
}
