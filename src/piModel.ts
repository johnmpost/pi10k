import * as O from "fp-ts/Option";
import { useReducer } from "react";
import { PiAction, KeycutState, Config } from "./types";
import { match } from "ts-pattern";

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

const reducer = (state: PiState, action: PiAction) =>
  match(action)
    .with({ kind: "clearKeycut" }, () =>
      O.isSome(state.keycut) ? { ...state, keycut: O.none } : state
    )
    .with({ kind: "startKeycut" }, ({ keycut }) =>
      O.isNone(state.keycut) ? { ...state, keycut } : state
    )
    .with({ kind: "setKeycutParameters" }, ({ newParameters }) =>
      O.isSome(state.keycut)
        ? { ...state, keycut: { ...state.keycut, parameters: newParameters } }
        : state
    )
    .with({ kind: "executeKeycut" }, () =>
      O.isSome(state.keycut)
        ? state // this should make a transformation based on the keycut
        : state
    )
    .exhaustive();

export const usePiReducer = () => useReducer(reducer, initialState);
