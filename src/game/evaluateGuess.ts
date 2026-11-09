export interface GuessResult {
  bulls: number;
  cows: number;
}

export function evaluateGuess(secret: string, guess: string): GuessResult {
  const secretArray = [...secret].map((char) => char.toLowerCase());
  const guessArray = [...guess].map((char) => char.toLowerCase());

  const bulls = guessArray.filter((char, index) => char === secretArray[index]).length;

  const bullIndexes = new Set(
    guessArray
      .map((char, index) => (char === secretArray[index] ? index : -1))
      .filter((index) => index !== -1),
  );

  const secretRest = secretArray.filter((_, index) => !bullIndexes.has(index));
  const guessRest = guessArray.filter((_, index) => !bullIndexes.has(index));

  const cows = guessRest.filter((char) => secretRest.includes(char)).length;

  return { bulls, cows };
}
