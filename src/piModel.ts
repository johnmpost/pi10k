import * as O from "fp-ts/Option";
import { useReducer } from "react";
import {
  PiAction,
  KeycutState,
  Config,
  Digit,
  StatefulKeycut,
  Unit,
  Direction,
} from "./types";
import { match } from "ts-pattern";
import { pipe } from "fp-ts/lib/function";
import { state } from "fp-ts";

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

const move = (
  state: PiState,
  count: number,
  direction: Direction,
  units: Unit
) => state;

const reducer = (state: PiState, action: PiAction) =>
  match(action)
    .with({ kind: "clearKeycut" }, () =>
      O.isSome(state.keycut) ? { ...state, keycut: O.none } : state
    )
    .with({ kind: "startKeycut" }, ({ keycut }) =>
      state.mode.kind === "practice" && O.isNone(state.keycut)
        ? { ...state, keycut }
        : state
    )
    .with({ kind: "setKeycutParameters" }, ({ newParameters }) =>
      O.isSome(state.keycut)
        ? { ...state, keycut: { ...state.keycut, parameters: newParameters } }
        : state
    )
    .with({ kind: "executeKeycut" }, () => executeKeycut(state))
    .with({ kind: "toggleMode" }, () =>
      state.mode.kind === "quiz"
        ? { ...state, mode: { kind: "practice" } }
        : { ...state, mode: { kind: "quiz", mistakesMade: 0, currLocation: 0 } }
    )
    .with({ kind: "restartQuiz" }, () =>
      state.mode.kind === "quiz"
        ? {
            ...state,
            mode: { ...state.mode, currLocation: 0, mistakesMade: 0 },
          }
        : state
    )
    .with({ kind: "toggleShowNextDigits" }, () =>
      state.mode.kind === "practice"
        ? {
            ...state,
            practice: { ...state.practice, nextDigitsVisibility: "show" },
          }
        : state
    )
    .with({ kind: "enterDigit" }, ({ digit }) => enterDigit(state, digit))
    .with({ kind: "move" }, ({ count, direction, units }) =>
      move(state, count, direction, units)
    )
    .exhaustive();

export const usePiReducer = () => useReducer(reducer, initialState);
