import * as O from "fp-ts/Option";
import { useReducer } from "react";
import { Digit, KeycutAction, KeycutState } from "./types";

export type PiState = {
  mode:
    | { kind: "practice" }
    | { kind: "quiz"; mistakesMade: number; currLocation: number };
  practice: {
    nextDigitsVisibility: "show" | "hide";
    markLocation: number;
    currLocation: number;
  };
  keycutOperator: O.Option<KeycutState>;
};

type PiAction = KeycutAction | { kind: "enterDigit"; digit: Digit };

const initialState: PiState = {};

const reducer = (state: PiState, action: PiAction) => state;

export const usePiReducer = () => useReducer(reducer, initialState);
