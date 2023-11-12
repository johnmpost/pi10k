import { Sheet, Stack, Typography } from "@mui/joy";
import { usePiReactogen } from "./piReducer";
import { handleKeypress } from "./piKeypressHandler";
import * as pi from "./piDigits";
import { useGlobalSelector } from "./globalState";
import { showPi, getCurrLocation, displayKeycut } from "./piUtils";
import { useState } from "react";
import "./test.css";

export const Pi = () => {
  const [opacity, setOpacity] = useState<0 | 1>(0);
  const { state, invoke } = usePiReactogen();
  const config = useGlobalSelector((x) => x.app.config);
  const shownPi = showPi(
    getCurrLocation(state),
    config.showExtraDigitsCount,
    pi.digits
  );

  return (
    <div
      style={{ height: "100vh" }}
      onKeyDown={handleKeypress(state, invoke)}
      tabIndex={-1}
    >
      <button
        onClick={async () => {
          setOpacity(1);
          setOpacity(0);
        }}
      >
        click
      </button>
      <Sheet sx={{ height: "100%" }}>
        <Typography level="h1">
          {state.mode.kind === "practice" ? "Practice Mode" : "Quiz Mode"}
        </Typography>
        <Typography level="h4" component="pre">
          {state.mode.kind === "quiz"
            ? `Mistakes: ${state.mode.mistakesMade}`
            : " "}
        </Typography>
        <Stack direction="column" alignItems="center">
          <Typography component="pre">{displayKeycut(state.keycut)}</Typography>
          <Stack direction="row" alignItems="center" justifyContent="center">
            <Typography component="pre" fontFamily="monospace" fontSize={64}>
              {shownPi.left}
            </Typography>
            <Typography component="pre" fontFamily="monospace" fontSize={64}>
              {shownPi.center}
            </Typography>
            {state.mode.kind === "practice" ? (
              <Typography component="pre" fontFamily="monospace" fontSize={64}>
                {state.practice.showNextDigits
                  ? shownPi.right
                  : " ".repeat(config.showExtraDigitsCount)}
              </Typography>
            ) : (
              <Typography
                component="pre"
                fontFamily="monospace"
                fontSize={64}
                color="danger"
                className={`error ${opacity === 0 ? "fade-out" : ""}`}
              >
                {`${state.mode.lastEntryWasMistake ? "X" : "X"}${" ".repeat(
                  config.showExtraDigitsCount - 1
                )}`}
              </Typography>
            )}
          </Stack>
          <Typography fontSize={24}>{getCurrLocation(state)}</Typography>
        </Stack>
      </Sheet>
    </div>
  );
};
