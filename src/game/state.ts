import { Attempt, GameState, Settings } from './types';

export const createInitialState = (): GameState => ({
  settings: null,
  secret: '',
  history: [],
  startTime: 0,
  status: 'settings',
});

export const startGame = (
  state: GameState,
  settings: Settings,
  secret: string,
  now: number,
): GameState => ({
  ...state,
  settings,
  secret,
  history: [],
  startTime: now,
  status: 'playing',
});

export const applyAttempt = (state: GameState, attempt: Attempt): GameState => {
  const isDuplicate = state.history.some(
    (a) => a.guess.toLowerCase() === attempt.guess.toLowerCase(),
  );
  if (isDuplicate) return state;

  const nextHistory = [...state.history, attempt];
  const isWon = attempt.bulls === (state.settings?.length ?? 0);

  return {
    ...state,
    history: nextHistory,
    status: isWon ? 'won' : 'playing',
  };
};
