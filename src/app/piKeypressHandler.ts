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
  unsafeUnwrap,
} from "./pureUtils";

export const handleKeypress =
  (state: PiState, invoke: (action: PiAction) => void) =>
  (e: React.KeyboardEvent<HTMLDivElement>) => {
    const createInvoke = (action: PiAction) => () => () => invoke(action);
    return pipe(
      state.keycut,
      O.match(
        () =>
          match(e.key)
            .with(hotkeys.toggleMode, createInvoke({ kind: "toggleMode" }))
            .with(hotkeys.restartQuiz, createInvoke({ kind: "restartQuiz" }))
            .with(
              hotkeys.toggleShowNextDigits,
              createInvoke({ kind: "toggleShowNextDigits" })
            )
            .with(
              hotkeys.startGotoKeycut,
              createInvoke({ kind: "startKeycut", keycut: "goto" })
            )
            .with(
              hotkeys.startSetMarkKeycut,
              createInvoke({ kind: "startKeycut", keycut: "setMark" })
            )
            .with(
              hotkeys.moveLeftOneDigit,
              createInvoke({
                kind: "move",
                direction: "left",
                units: "digits",
              })
            )
            .with(
              hotkeys.moveRightOneDigit,
              createInvoke({
                kind: "move",
                direction: "right",
                units: "digits",
              })
            )
            .with(
              hotkeys.moveLeftOneGroup,
              createInvoke({
                kind: "move",
                direction: "left",
                units: "groups",
              })
            )
            .with(
              hotkeys.moveRightOneGroup,
              createInvoke({
                kind: "move",
                direction: "right",
                units: "groups",
              })
            )
            .with(
              P.when(isDigit),
              (digitStr) => () =>
                invoke({
                  kind: "enterDigit",
                  digit: flow(stringToDigit, unsafeUnwrap)(digitStr),
                })
            )
            .otherwise(() => () => {}),
        (keycut) =>
          match(e.key)
            .with("Escape", createInvoke({ kind: "clearKeycut" }))
            .with("Enter", createInvoke({ kind: "executeKeycut" }))
            .with(
              "Backspace",
              createInvoke({
                kind: "setKeycutParameters",
                newParameters: backspace(keycut.parameters),
              })
            )
            .with(
              P.when(isOneCharacter),
              (digitStr) => () =>
                invoke({
                  kind: "setKeycutParameters",
                  newParameters: keycut.parameters + digitStr,
                })
            )
            .otherwise(() => () => {})
      )
    )();
  };
