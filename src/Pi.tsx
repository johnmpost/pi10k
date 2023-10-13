import { Sheet } from "@mui/joy";
import { usePiReducer } from "./piModel";
import { P, match } from "ts-pattern";
import { hotkeys } from "./constants";
import { PiAction } from "./types";
import * as O from "fp-ts/Option";
import { flow, pipe } from "fp-ts/lib/function";
import { isDigit, stringToDigit, throwIfNone } from "./utils";

export const Pi = () => {
  const [state, dispatch] = usePiReducer();
  const createDispatch = (action: PiAction) => () => () => dispatch(action);

  const handleKeypress: React.KeyboardEventHandler<HTMLDivElement> = (e) =>
    pipe(
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
        () =>
          match(e.key)
            .with("Escape", createDispatch({ kind: "clearKeycut" }))
            .with("Enter", createDispatch({ kind: "executeKeycut" }))
            .otherwise(() => () => {})
      )
    )();

  return (
    <div style={{ height: "100vh" }} onKeyDown={handleKeypress} tabIndex={-1}>
      <Sheet sx={{ height: "100%" }}>
        <pre style={{ margin: 0 }}>{`state: ${JSON.stringify(
          state,
          null,
          2
        )}`}</pre>
      </Sheet>
    </div>
  );
};
