import * as O from "fp-ts/Option";
import { useReducer } from "react";
import {
  PiAction,
  KeycutState,
  Config,
  Digit,
  StatefulKeycut,
  Move,
  Goto,
  SetMark,
} from "./types";
import { match } from "ts-pattern";
import { pipe } from "fp-ts/lib/function";

export type PiState = {
  mode:
    | { kind: "practice" }
    | { kind: "quiz"; mistakesMade: number; currLocation: number };
  practice: {
    nextDigitsVisibility: "show" | "hide";
    markLocation: O.Option<number>;
    currLocation: number;
  };
  keycut: O.Option<KeycutState>;
  config: Config;
};

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

const enterDigit = (state: PiState, digit: Digit) => state;

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

const move = (state: PiState, parameters: Move) => state;

const goto = (state: PiState, parameters: Goto) => state;

const setMark = (state: PiState, parameters: SetMark) => state;

const startKeycut = (state: PiState, keycut: StatefulKeycut) =>
  state.mode.kind === "practice" && O.isNone(state.keycut)
    ? { ...state, keycut: O.some({ kind: keycut, parameters: "" }) }
    : state;

const setKeycutParameters = (state: PiState, newParameters: string) =>
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
    .with({ kind: "startKeycut" }, ({ keycut }) => startKeycut(state, keycut))
    .with({ kind: "setKeycutParameters" }, ({ newParameters }) =>
      setKeycutParameters(state, newParameters)
    )
    .with({ kind: "executeKeycut" }, () => executeKeycut(state))
    .with({ kind: "toggleMode" }, () => toggleMode(state))
    .with({ kind: "restartQuiz" }, () => restartQuiz(state))
    .with({ kind: "toggleShowNextDigits" }, () => toggleShowNextDigits(state))
    .with({ kind: "enterDigit" }, ({ digit }) => enterDigit(state, digit))
    .with({ kind: "move" }, ({ parameters }) => move(state, parameters))
    .with({ kind: "goto" }, ({ parameters }) => goto(state, parameters))
    .with({ kind: "setMark" }, ({ parameters }) => setMark(state, parameters))
    .exhaustive();

export const usePiReducer = () => useReducer(reducer, initialState);
