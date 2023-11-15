import {
  PiAction,
  Move,
  Goto,
  SetMark,
  EnterDigit,
  StartKeycut,
  SetKeycutParameters,
  PiState,
  Config,
} from "./types";
import { match } from "ts-pattern";
import { flow, pipe } from "fp-ts/lib/function";
import { useGlobalSelector } from "./globalState";
import {
  nextDigitIsCorrect,
  quizHasFailed,
  parseGotoParameters,
  parseSetMarkParameters,
  locationInBounds,
} from "./piUtils";
import { O } from "../fp-ts-exports";
import { ActionHandler, useReactogen } from "./useReactogen";
import { doNothing } from "./pureUtils";

const initialState: PiState = {
  mode: {
    kind: "practice",
  },
  practice: {
    showNextDigits: true,
    markLocation: 0,
    currLocation: 0,
  },
  keycut: O.none,
};

const clearKeycut = (state: PiState) =>
  O.isSome(state.keycut) ? { ...state, keycut: O.none } : state;

const enterDigit =
  (allowedQuizMistakes: number) =>
  ({ digit }: EnterDigit) =>
  (state: PiState) =>
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
          mode: {
            ...state.mode,
            currLocation: state.mode.currLocation + 1,
            lastEntryWasMistake: false,
          },
        }
      : {
          ...state,
          mode: {
            ...state.mode,
            mistakesMade: state.mode.mistakesMade + 1,
            lastEntryWasMistake: true,
          },
        };

const executeKeycut = (state: PiState) =>
  pipe(
    state.keycut,
    O.chain((keycutState) =>
      match(keycutState)
        .with(
          { kind: "goto" },
          flow(
            parseGotoParameters,
            O.map((x) => goto(x)(state))
          )
        )
        .with(
          { kind: "setMark" },
          flow(
            parseSetMarkParameters,
            O.map((x) => setMark(x)(state))
          )
        )
        .exhaustive()
    ),
    O.map((state) => ({ ...state, keycut: O.none })),
    O.getOrElse(() => state)
  );

const move = (parameters: Move) => (state: PiState) =>
  match(state.mode)
    .with({ kind: "practice" }, () =>
      match(parameters.units)
        .with("digits", () => {
          const locationAfterMove =
            state.practice.currLocation +
            (parameters.direction === "left" ? -1 : 1);
          const newLocation = locationInBounds(locationAfterMove)
            ? locationAfterMove
            : state.practice.currLocation;
          return {
            ...state,
            practice: {
              ...state.practice,
              currLocation: newLocation,
            },
          };
        })
        .with("groups", () => {
          console.warn("moving by groups not yet implemented");
          return state;
        })
        .exhaustive()
    )
    .with({ kind: "quiz" }, () => state)
    .exhaustive();

const goto = (parameters: Goto) => (state: PiState) =>
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

const setMark = (parameters: SetMark) => (state: PiState) =>
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
  ({ keycut }: StartKeycut) =>
  (state: PiState) =>
    state.mode.kind === "practice" && O.isNone(state.keycut)
      ? { ...state, keycut: O.some({ kind: keycut, parameters: "" }) }
      : state;

const setKeycutParameters =
  ({ newParameters }: SetKeycutParameters) =>
  (state: PiState) =>
    O.isSome(state.keycut)
      ? {
          ...state,
          keycut: O.some({
            kind: state.keycut.value.kind,
            parameters: newParameters,
          }),
        }
      : state;

const toggleMode = (state: PiState): PiState =>
  state.mode.kind === "quiz"
    ? { ...state, mode: { kind: "practice" } }
    : {
        ...state,
        mode: {
          kind: "quiz",
          mistakesMade: 0,
          currLocation: 0,
          lastEntryWasMistake: false,
        },
      };

const restartQuiz = (state: PiState) =>
  state.mode.kind === "quiz"
    ? {
        ...state,
        mode: { ...state.mode, currLocation: 0, mistakesMade: 0 },
      }
    : state;

const toggleShowNextDigits = (state: PiState) =>
  state.mode.kind === "practice"
    ? {
        ...state,
        practice: {
          ...state.practice,
          showNextDigits: !state.practice.showNextDigits,
        },
      }
    : state;

const handleAction =
  (forceRenderError: () => void) =>
  ({ allowedQuizMistakes }: Config): ActionHandler<PiState, PiAction> =>
  (setState) =>
  (action) =>
  (previousState) =>
    match(action)
      .with({ kind: "clearKeycut" }, () => () => setState(clearKeycut))
      .with(
        { kind: "startKeycut" },
        (action) => () => setState(startKeycut(action))
      )
      .with(
        { kind: "setKeycutParameters" },
        (action) => () => setState(setKeycutParameters(action))
      )
      .with(
        { kind: "executeKeycut" },
        () => () => setState((s) => executeKeycut(s))
      )
      .with({ kind: "toggleMode" }, () => () => setState(toggleMode))
      .with({ kind: "restartQuiz" }, () => () => setState(restartQuiz))
      .with(
        { kind: "toggleShowNextDigits" },
        () => () => setState(toggleShowNextDigits)
      )
      .with({ kind: "enterDigit" }, (action) => () => {
        setState(enterDigit(allowedQuizMistakes)(action));
        (previousState.mode.kind === "quiz" &&
          previousState.mode.mistakesMade <= allowedQuizMistakes
          ? forceRenderError
          : doNothing)();
      })
      .with({ kind: "move" }, (action) => () => setState(move(action)))
      .with({ kind: "goto" }, (action) => () => setState(goto(action)))
      .with({ kind: "setMark" }, (action) => () => setState(setMark(action)))
      .exhaustive();

export const usePiReactogen = (forceRenderError: () => void) => {
  const config = useGlobalSelector((state) => state.app.config);

  return useReactogen(initialState, handleAction(forceRenderError)(config));
};
