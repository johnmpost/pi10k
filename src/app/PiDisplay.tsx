import { Sheet, Stack, Typography } from "@mui/joy";
import { usePiReactogen } from "./piReducer";
import { handleKeypress } from "./piKeypressHandler";
import * as pi from "./piDigits";
import { showPi, getCurrLocation, displayKeycut } from "./piUtils";
import "./fadeOut.css";
import { useForceRender } from "./useForceRender";
import { useGlobalState } from "./GlobalStateProvider";

export const Pi = () => {
  const [errorKey, forceRenderError] = useForceRender();
  const { state, invoke } = usePiReactogen(forceRenderError);
  const { config } = useGlobalState();
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
                className="fade-out"
                key={errorKey}
              >
                {`${state.mode.lastEntryWasMistake ? "X" : " "}${" ".repeat(
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
