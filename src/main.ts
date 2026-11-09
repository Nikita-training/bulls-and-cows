import './style.css';
import { AVAILABLE_BASES, LENGTHS, validLengthsForBase } from './game/settings';
import { Base, RecordEntry, GameState } from './game/types';
import { generateSecret } from './game/generateSecret';
import { isValidGuess } from './game/isValidGuess';
import { createDigitValidator } from './game/createDigitValidator';
import { evaluateGuess } from './game/evaluateGuess';
import { countPossibleSecrets } from './game/countPossibleSecrets';
import { applyAttempt, createInitialState, startGame } from './game/state';
import { addRecord, loadRecords } from './game/records';
import { el } from './ui/dom';

const BASE_LABEL: Record<Base, string> = { 2: 'bin', 8: 'oct', 10: 'dec', 16: 'hex' };

let state: GameState = createInitialState();
let selectedLength = 4;
let selectedBase: Base = 10;
let timerId: number | null = null;

const app = el('div', 'app');
document.body.appendChild(app);

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function render(): void {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
  app.replaceChildren();

  if (state.status === 'settings') {
    renderSettingsScreen();
  } else {
    renderGameScreen();
  }
}

function renderSettingsScreen(): void {
  const allowedLengths = validLengthsForBase(selectedBase);

  if (!allowedLengths.includes(selectedLength)) {
    selectedLength = allowedLengths[0];
  }

  const title = el('h1', '', 'Bulls & Cows');
  const lengthSelect = createLengthSelect(allowedLengths);
  const baseSelect = createBaseSelect();

  const startBtn = el('button', 'primary', 'Start Game');
  startBtn.addEventListener('click', () => {
    const secret = generateSecret(selectedLength, selectedBase);
    state = startGame(state, { length: selectedLength, base: selectedBase }, secret, Date.now());
    render();
  });

  const possibleSecrets = countPossibleSecrets(selectedLength, selectedBase);
  const info = el('p', 'info', `Possible secrets: ${possibleSecrets}`);

  app.appendChild(title);
  app.appendChild(createLabel('Length: ', lengthSelect));
  app.appendChild(createLabel('Base: ', baseSelect));
  app.appendChild(startBtn);
  app.appendChild(info);
  app.appendChild(createRecordsTable());
}

function createLengthSelect(allowedLengths: number[]): HTMLSelectElement {
  const select = el('select');

  LENGTHS.forEach((l) => {
    const opt = el('option', '', String(l));
    opt.value = String(l);
    opt.selected = l === selectedLength;
    opt.disabled = !allowedLengths.includes(l);
    select.appendChild(opt);
  });

  select.addEventListener('change', () => {
    selectedLength = Number(select.value);
    render();
  });

  return select;
}

function createBaseSelect(): HTMLSelectElement {
  const select = el('select');

  AVAILABLE_BASES.forEach((b) => {
    const opt = el('option', '', b.label);
    opt.value = String(b.base);
    opt.selected = b.base === selectedBase;
    select.appendChild(opt);
  });

  select.addEventListener('change', () => {
    selectedBase = Number(select.value) as Base;
    render();
  });

  return select;
}

function createLabel(text: string, inputElement: HTMLElement): HTMLLabelElement {
  const label = el('label', '', text);
  label.appendChild(inputElement);
  return label;
}

function renderGameScreen(): void {
  const settings = state.settings!;

  const title = el('h2', '', `Play: ${settings.length} digits, Base ${BASE_LABEL[settings.base]}`);
  const timerDisplay = createTimer();
  const historyList = createHistoryList();

  let winBanner = el('div');
  if (state.status === 'won') {
    winBanner = el('div', 'win', `🎉 You won in ${state.history.length} attempts!`);
  }

  const newGameBtn = el('button', 'secondary', 'New Game');
  newGameBtn.addEventListener('click', () => {
    state = createInitialState();
    render();
  });
  app.appendChild(title);
  app.appendChild(timerDisplay);
  app.appendChild(winBanner);

  if (state.status === 'playing') {
    app.appendChild(createGameInput(settings));
  }

  app.appendChild(el('h3', '', 'History'));
  app.appendChild(historyList);
  app.appendChild(newGameBtn);
}

function createTimer(): HTMLDivElement {
  const display = el('div', 'timer', 'Time: 0:00');

  const updateTime = () => {
    display.textContent = `Time: ${formatTime(Date.now() - state.startTime)}`;
  };
  updateTime();

  if (state.status === 'playing') {
    timerId = window.setInterval(updateTime, 500);
  }

  return display;
}

function createGameInput(settings: { length: number; base: Base }): HTMLDivElement {
  const container = el('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '0.5rem';

  const isDigit = createDigitValidator(settings.base);

  const input = el('input');
  input.maxLength = settings.length;
  input.placeholder = 'Enter guess...';

  const message = el('p', 'message');

  input.addEventListener('input', () => {
    const typedValue = input.value.toLowerCase();
    const filteredValue = [...typedValue].filter(isDigit).join('');

    if (typedValue.length !== filteredValue.length) {
      message.textContent = `Invalid character! Only digits for base ${settings.base} are allowed.`;
    } else {
      if (message.textContent?.startsWith('Invalid character')) {
        message.textContent = '';
      }
    }

    input.value = filteredValue;
  });

  const submitBtn = el('button', 'primary', 'Submit Guess');

  const handleSubmit = () => {
    const guess = input.value.toLowerCase();

    if (!isValidGuess(guess, settings.length, settings.base)) {
      message.textContent = `Invalid guess! Must be ${settings.length} unique digits.`;
      return;
    }

    if (state.history.some((a) => a.guess === guess)) {
      message.textContent = 'You already tried this!';
      return;
    }

    const result = evaluateGuess(state.secret, guess);
    state = applyAttempt(state, { guess, ...result });

    input.value = '';
    message.textContent = '';

    if (state.status === 'won') {
      saveCurrentRecord(settings);
    }

    render();
  };

  submitBtn.addEventListener('click', handleSubmit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSubmit();
  });

  container.appendChild(input);
  container.appendChild(submitBtn);
  container.appendChild(message);
  return container;
}

function createHistoryList(): HTMLOListElement {
  const list = el('ol', 'history-list');

  state.history.forEach((attempt) => {
    const text = `${attempt.guess} ➔ ${attempt.bulls} bulls, ${attempt.cows} cows`;
    list.appendChild(el('li', '', text));
  });

  return list;
}

function saveCurrentRecord(settings: { length: number; base: Base }): void {
  const timeMs = Date.now() - state.startTime;
  const entry: RecordEntry = {
    length: settings.length,
    base: settings.base,
    attempts: state.history.length,
    timeMs,
    date: new Date().toISOString().slice(0, 10),
  };
  addRecord(entry);
}

function createRecordsTable(): HTMLDivElement {
  const container = el('div', 'records');
  container.appendChild(el('h3', '', 'Top 10 Records'));

  const records: RecordEntry[] = loadRecords();

  if (records.length === 0) {
    container.appendChild(el('p', '', 'No records yet. Play to set one!'));
    return container;
  }

  const table = el('table');
  const header = el('tr');

  ['#', 'Length', 'Base', 'Attempts', 'Time', 'Date'].forEach((text) => {
    header.appendChild(el('th', '', text));
  });
  table.appendChild(header);

  records.forEach((record, index) => {
    const row = el('tr');
    const rowData = [
      String(index + 1),
      String(record.length),
      BASE_LABEL[record.base],
      String(record.attempts),
      formatTime(record.timeMs),
      record.date,
    ];

    rowData.forEach((text) => {
      row.appendChild(el('td', '', text));
    });

    table.appendChild(row);
  });

  container.appendChild(table);
  return container;
}

render();
