import { P, match } from "ts-pattern";
import { hotkeys } from "./constants";
import { PiAction, PiState } from "./types";
import { O } from "../fp-ts-exports";
import { flow, pipe } from "fp-ts/lib/function";
import {
  backspace,
  isDigit,
  isOneCharacter,
  stringToDigit,
  throwIfNone,
} from "./utils";

export const handleKeypress =
  (state: PiState, dispatch: React.Dispatch<PiAction>) =>
  (e: React.KeyboardEvent<HTMLDivElement>) => {
    const createDispatch = (action: PiAction) => () => () => dispatch(action);
    return pipe(
      state.keycut,
      O.match(
        () =>
          match(e.key)
            .with(hotkeys.toggleMode, createDispatch({ kind: "toggleMode" }))
            .with(hotkeys.restartQuiz, createDispatch({ kind: "restartQuiz" }))
            .with(
              hotkeys.toggleShowNextDigits,
              createDispatch({ kind: "toggleShowNextDigits" })
            )
            .with(
              hotkeys.startGotoKeycut,
              createDispatch({ kind: "startKeycut", keycut: "goto" })
            )
            .with(
              hotkeys.startSetMarkKeycut,
              createDispatch({ kind: "startKeycut", keycut: "setMark" })
            )
            .with(
              hotkeys.moveLeftOneDigit,
              createDispatch({
                kind: "move",
                direction: "left",
                units: "digits",
              })
            )
            .with(
              hotkeys.moveRightOneDigit,
              createDispatch({
                kind: "move",
                direction: "right",
                units: "digits",
              })
            )
            .with(
              hotkeys.moveLeftOneGroup,
              createDispatch({
                kind: "move",
                direction: "left",
                units: "groups",
              })
            )
            .with(
              hotkeys.moveRightOneGroup,
              createDispatch({
                kind: "move",
                direction: "right",
                units: "groups",
              })
            )
            .with(
              P.when(isDigit),
              (digitStr) => () =>
                dispatch({
                  kind: "enterDigit",
                  digit: flow(stringToDigit, throwIfNone)(digitStr),
                })
            )
            .otherwise(() => () => {}),
        (keycut) =>
          match(e.key)
            .with("Escape", createDispatch({ kind: "clearKeycut" }))
            .with("Enter", createDispatch({ kind: "executeKeycut" }))
            .with(
              "Backspace",
              createDispatch({
                kind: "setKeycutParameters",
                newParameters: backspace(keycut.parameters),
              })
            )
            .with(
              P.when(isOneCharacter),
              (digitStr) => () =>
                dispatch({
                  kind: "setKeycutParameters",
                  newParameters: keycut.parameters + digitStr,
                })
            )
            .otherwise(() => () => {})
      )
    )();
  };
