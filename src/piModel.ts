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
} from "./types";
import { match } from "ts-pattern";
import { flow, pipe } from "fp-ts/lib/function";
import {
  nextDigitIsCorrect,
  parseGotoParameters,
  parseSetMarkParameters,
  quizHasFailed,
} from "./utils";

const initialState: PiState = {
  mode: {
    kind: "practice",
  },
  practice: {
    nextDigitsVisibility: "show",
    markLocation: 0,
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
    O.chain((keycutState) =>
      match(keycutState)
        .with({ kind: "goto" }, flow(parseGotoParameters, O.map(goto(state))))
        .with(
          { kind: "setMark" },
          flow(parseSetMarkParameters, O.map(setMark(state)))
        )
        .exhaustive()
    ),
    O.map((state) => ({ ...state, keycut: O.none })),
    O.getOrElse(() => state)
  );

const move = (state: PiState) => (parameters: Move) => {
  return match(parameters.units)
    .with("digits", () => ({
      ...state,
      practice: {
        ...state.practice,
        currLocation:
          state.practice.currLocation +
          (parameters.direction === "left" ? -1 : 1),
      },
    }))
    .with("groups", () => {
      throw Error("moving by groups not yet implemented");
    })
    .exhaustive();
};

const goto =
  (state: PiState) =>
  (parameters: Goto): PiState =>
    match(parameters.location)
      .with({ kind: "location" }, ({ location }) => ({
        ...state,
        practice: { ...state.practice, currLocation: location },
      }))
      .with({ kind: "mark" }, () => ({
        ...state,
        practice: {
          ...state.practice,
          currLocation: state.practice.markLocation,
        },
      }))
      .exhaustive();

const setMark = (state: PiState) => (parameters: SetMark) =>
  match(parameters.location)
    .with({ kind: "atLocation" }, ({ location }) => ({
      ...state,
      practice: { ...state.practice, markLocation: location },
    }))
    .with({ kind: "currentLocation" }, () => ({
      ...state,
      practice: {
        ...state.practice,
        markLocation: state.practice.currLocation,
      },
    }))
    .exhaustive();

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
