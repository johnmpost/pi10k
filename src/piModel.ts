import * as O from "fp-ts/Option";
import { useReducer } from "react";
import { Digit, KeycutAction, KeycutState } from "./types";

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
};

type PiAction =
  | KeycutAction
  | { kind: "enterDigit"; digit: Digit }
  | { kind: "clearKeycut" }
  | { kind: "startKeycut" }
  | { kind: "executeKeycut" }
  | { kind: "setKeycutParameters" };

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
};

const reducer = (state: PiState, action: PiAction) => state;

export const usePiReducer = () => useReducer(reducer, initialState);
