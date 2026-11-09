# Design Document: Bulls and Cows

## 1. Data Structures and Algorithms

### Game State (State and History)

The game state is a simple JavaScript object. We do not use classes because the assignment requires Functional Programming.

- **History**: We use an array to store attempts (`Attempt[]`). When a new attempt is made, we create a new array `[...history, newAttempt]`. We do not change (mutate) the old array. This is called **immutability**. It makes the game predictable and easy to test.
- **Secret**: It is a `string` (not a number). This is important to handle leading zeros (e.g., `"0123"`).

### `evaluateGuess` Algorithm

This function compares the secret and the guess. It uses array methods (`filter`, `map`) and no manual loops.

1. First, it finds **bulls** (correct digit, correct position) using `filter`.
2. It saves the index of these bulls in a `Set`.
3. Then, it filters out the bulls from both the secret and the guess.
4. Finally, it finds **cows** (correct digit, wrong position) by checking if the remaining guessed digits exist in the remaining secret.

### `countPossibleSecrets` Algorithm

This function calculates how many unique secrets can be created. The formula is P(base, length) = base! / (base - length)!.
It uses **recursion**: `count(length, base) = base * count(length - 1, base - 1)`.
To make it fast, it uses **memoization**. It saves the result in a `Map` cache. If we ask the same question again, it returns the cached answer immediately without recalculating.

---

## 2. Complexity (Big O)

- **`generateSecret(length, base, random)`**:
  - **Time**: `O(length * base)`. We loop `length` times. Inside the loop, we filter the `base` array to remove the chosen digit.
  - **Space**: `O(length + base)` because we create a pool array of all digits and a string of the secret.
- **`evaluateGuess(secret, guess)`**:
  - **Time**: `O(n²)`, where `n` is the length of the guess. We filter for bulls (`O(n)`). Then, for each remaining guess digit, we check `.includes()` in the secret (`O(n)`). So, `n * n = O(n²)`. Since `n` is very small (max 6), it is very fast.
  - **Space**: `O(n)` to store the arrays and the Set of indices.
- **`isValidGuess(guess, length, base)`**:
  - **Time**: `O(n)`. We check the string once with `.every()` to validate digits, and once to check for duplicates using a `Set`.
  - **Space**: `O(n)` to store the characters in a `Set`.
- **`countPossibleSecrets(length, base)`**:
  - **Time**: `O(length)` for the first call. It makes `length` recursive calls. After that, it is `O(1)` (instant) because of the **memoization** cache.
  - **Space**: `O(length)` for the call stack and the cache size.

---

## 3. Clean Code Principles

Here is how we applied Clean Code principles in this project:

- **Dependency Injection**: In `src/game/generateSecret.ts`, the function takes `random` as a parameter. This means we can pass a fake random generator in tests to make the result predictable. The function does not depend on `Math.random` directly.
- **Single Responsibility Principle (SRP)**: Every function does only one thing. For example, `src/game/evaluateGuess.ts` only compares numbers. It does not know about the DOM or the screen.
- **Currying**: In `src/game/createDigitValidator.ts`, we use a curried factory. First, we pass the `base`. It returns a new function that checks a character. We use this function in two places: in `isValidGuess.ts` (to check the whole guess) and in `main.ts` (to filter input in real-time).
- **Immutability**: In `src/game/state.ts`, the function `applyAttempt` never changes the old state. It returns a new object: `{ ...state, history: [...state.history, attempt] }`. This prevents unexpected bugs.
- **Error Handling**: In `src/game/records.ts`, we use `try/catch` around `localStorage`. If the browser blocks storage, the game will not crash. It just returns an empty list.
