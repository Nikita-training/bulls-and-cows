import { describe, it, expect } from 'vitest';
import { createInitialState, startGame, applyAttempt } from '../src/game/state';

describe('game state logic', () => {
  it('starts with initial settings state', () => {
    const state = createInitialState();
    expect(state.status).toBe('settings');
    expect(state.history).toEqual([]);
  });

  it('transitions to playing mode when game starts', () => {
    const playing = startGame(createInitialState(), { length: 4, base: 10 }, '1234', 1000);
    expect(playing.status).toBe('playing');
    expect(playing.secret).toBe('1234');
  });

  it('adds attempts immutably and rejects duplicates', () => {
    let state = startGame(createInitialState(), { length: 4, base: 10 }, '1234', 1000);
    state = applyAttempt(state, { guess: '5678', bulls: 0, cows: 0 });
    expect(state.history.length).toBe(1);

    const duplicate = applyAttempt(state, { guess: '5678', bulls: 0, cows: 0 });
    expect(duplicate.history.length).toBe(1);
    expect(duplicate).toBe(state);
  });

  it('changes status to won when bulls equal length', () => {
    let state = startGame(createInitialState(), { length: 4, base: 10 }, '1234', 1000);
    state = applyAttempt(state, { guess: '1234', bulls: 4, cows: 0 });
    expect(state.status).toBe('won');
  });
});
