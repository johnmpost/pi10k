import * as O from "fp-ts/Option";
import { useReducer } from "react";

export type Direction = "left" | "right";

export type KeycutAction =
  | { kind: "toggleMode" }
  | { kind: "restartQuiz" }
  | { kind: "toggleShowNextDigits" }
  | {
      kind: "move";
      count: number;
      direction: Direction;
      units: "digits" | "groups";
    }
  | {
      kind: "setMark";
      location: { kind: "currentDigit" } | { kind: "atDigit"; digit: number };
    }
  | {
      kind: "goto";
      location: { kind: "digit"; digit: number } | { kind: "mark" };
    };

export type KeycutState = {
  kind: "move" | "setMark" | "goto";
  parameters: string;
};

export type Grouping = {
  startDigit: number;
  groupSize: number;
};

export type Config = {
  showExtraDigitsCount: number;
  allowedQuizMistakes: number;
  groupings: Grouping[];
};

export type PiState = {
  mode:
    | { kind: "practice" }
    | { kind: "quiz"; mistakesMade: number; currDigit: number };
  practice: {
    nextDigitsVisibility: "show" | "hide";
    markDigit: number;
    currDigit: number;
  };
  keycutOperator: O.Option<KeycutState>;
  config: Config;
};

type PiAction = {};

const initialState: PiState = {};

const reducer = (state: PiState, action: PiAction) => state;

export const usePiReducer = () => useReducer(reducer, initialState);
