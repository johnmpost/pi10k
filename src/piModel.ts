import * as O from "fp-ts/Option";
import { useReducer } from "react";
import {
  PiAction,
  Move,
  Goto,
  SetMark,
  EnterDigit,
  StartKeycut,
  SetKeycutParameters,
  PiState,
  Digit,
} from "./types";
import { match } from "ts-pattern";
import { pipe } from "fp-ts/lib/function";
import * as pi from "./pi";

const initialState: PiState = {
  mode: {
    kind: "practice",
  },
  practice: {
    nextDigitsVisibility: "show",
    markLocation: O.none,
    currLocation: 0,
  },
  keycut: O.none,
  config: {
    showExtraDigitsCount: 4,
    allowedQuizMistakes: 3,
    groupings: [],
  },
};

const clearKeycut = (state: PiState) =>
  O.isSome(state.keycut) ? { ...state, keycut: O.none } : state;

const nextDigitIsCorrect = (currLocation: number, attemptedDigit: Digit) => {
  const nextLocation = currLocation + 1;
  const expectedNextDigit = pi.digits[nextLocation];
  const digitIsCorrect = attemptedDigit === expectedNextDigit;
  return digitIsCorrect;
};

const quizHasFailed = (mistakesMade: number) => (mistakesAllowed: number) =>
  mistakesMade > mistakesAllowed;

const enterDigit =
  (allowedQuizMistakes: number) =>
  (state: PiState) =>
  ({ digit }: EnterDigit): PiState =>
    state.mode.kind === "practice"
      ? nextDigitIsCorrect(state.practice.currLocation, digit)
        ? {
            ...state,
            practice: {
              ...state.practice,
              currLocation: state.practice.currLocation + 1,
            },
          }
        : state
      : quizHasFailed(state.mode.mistakesMade)(allowedQuizMistakes)
      ? state
      : nextDigitIsCorrect(state.mode.currLocation, digit)
      ? {
          ...state,
          mode: { ...state.mode, currLocation: state.mode.currLocation + 1 },
        }
      : {
          ...state,
          mode: { ...state.mode, mistakesMade: state.mode.mistakesMade + 1 },
        };

const executeKeycut = (state: PiState) =>
  pipe(
    state.keycut,
    O.map((keycutState) =>
      match(keycutState)
        .with({ kind: "goto" }, () => state)
        .with({ kind: "move" }, () => state)
        .with({ kind: "setMark" }, () => state)
        .exhaustive()
    ),
    O.getOrElse(() => state)
  );

const move = (state: PiState) => (parameters: Move) => state;

const goto = (state: PiState) => (parameters: Goto) => state;

const setMark = (state: PiState) => (parameters: SetMark) => state;

const startKeycut =
  (state: PiState) =>
  ({ keycut }: StartKeycut) =>
    state.mode.kind === "practice" && O.isNone(state.keycut)
      ? { ...state, keycut: O.some({ kind: keycut, parameters: "" }) }
      : state;

const setKeycutParameters =
  (state: PiState) =>
  ({ newParameters }: SetKeycutParameters) =>
    O.isSome(state.keycut)
      ? { ...state, keycut: { ...state.keycut, parameters: newParameters } }
      : state;

const toggleMode = (state: PiState): PiState =>
  state.mode.kind === "quiz"
    ? { ...state, mode: { kind: "practice" } }
    : { ...state, mode: { kind: "quiz", mistakesMade: 0, currLocation: 0 } };

const restartQuiz = (state: PiState) =>
  state.mode.kind === "quiz"
    ? {
        ...state,
        mode: { ...state.mode, currLocation: 0, mistakesMade: 0 },
      }
    : state;

const toggleShowNextDigits = (state: PiState): PiState =>
  state.mode.kind === "practice"
    ? {
        ...state,
        practice: { ...state.practice, nextDigitsVisibility: "show" },
      }
    : state;

const reducer = (state: PiState, action: PiAction): PiState =>
  match(action)
    .with({ kind: "clearKeycut" }, () => clearKeycut(state))
    .with({ kind: "startKeycut" }, startKeycut(state))
    .with({ kind: "setKeycutParameters" }, setKeycutParameters(state))
    .with({ kind: "executeKeycut" }, () => executeKeycut(state))
    .with({ kind: "toggleMode" }, () => toggleMode(state))
    .with({ kind: "restartQuiz" }, () => restartQuiz(state))
    .with({ kind: "toggleShowNextDigits" }, () => toggleShowNextDigits(state))
    .with({ kind: "enterDigit" }, enterDigit(2)(state))
    .with({ kind: "move" }, move(state))
    .with({ kind: "goto" }, goto(state))
    .with({ kind: "setMark" }, setMark(state))
    .exhaustive();

export const usePiReducer = () => useReducer(reducer, initialState);
