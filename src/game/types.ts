export type Base = 2 | 8 | 10 | 16;

export interface GuessResult {
  bulls: number;
  cows: number;
}

export interface Attempt extends GuessResult {
  guess: string;
}

export interface Settings {
  length: number;
  base: Base;
}

export type Status = 'settings' | 'playing' | 'won';

export interface GameState {
  settings: Settings | null;
  secret: string;
  history: Attempt[];
  startTime: number;
  status: Status;
}
