import { Sheet, Stack, Typography } from "@mui/joy";
import { usePiReducer } from "./piReducer";
import { handleKeypress } from "./piKeypressHandler";
import * as pi from "./piDigits";
import { useGlobalSelector } from "./globalState";
import { showPi, getCurrLocation, displayKeycut } from "./piUtils";

export const Pi = () => {
  const [state, dispatch] = usePiReducer();
  const config = useGlobalSelector((x) => x.app.config);
  const shownPi = showPi(
    getCurrLocation(state),
    config.showExtraDigitsCount,
    pi.digits
  );

  return (
    <div
      style={{ height: "100vh" }}
      onKeyDown={handleKeypress(state, dispatch)}
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
              >
                {`${state.mode.lastEntryWasMistake ? "?" : " "}${" ".repeat(
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
