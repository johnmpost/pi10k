import { IconButton, Sheet, Stack, Typography } from "@mui/joy";
import { usePiReactogen } from "./piReactogen";
import { handleKeypress } from "./piKeypressHandler";
import * as pi from "./piDigits";
import { showPi, getCurrLocation, displayKeycut } from "./piUtils";
import "./fadeOut.css";
import { useForceRender } from "./useForceRender";
import { useGlobalState } from "./globalState";
import { Link as RouterLink } from "react-router-dom";
import { HelpOutline, Settings } from "@mui/icons-material";
import { ModeToggle } from "./ModeToggle";
import { useEffect, useRef, useState } from "react";
import { userGuideUrl } from "./constants";

export const Pi = () => {
  const [errorKey, forceRenderError] = useForceRender();
  const { state, invoke } = usePiReactogen(forceRenderError);
  const { config } = useGlobalState();
  const [focused, setFocused] = useState(false);
  const mainDivRef = useRef<HTMLDivElement>(null);
  const shownPi = showPi(
    getCurrLocation(state),
    config.showExtraDigitsCount,
    pi.digits
  );

  useEffect(() => {
    if (mainDivRef.current) {
      mainDivRef.current.focus();
    }
  }, []);

  return (
    <div
      style={{ height: "100vh" }}
      onKeyDown={handleKeypress(state, invoke)}
      tabIndex={-1}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      ref={mainDivRef}
    >
      <Sheet sx={{ height: "100%", padding: 2, overflow: "clip" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography level="h1">
            {state.mode.kind === "practice" ? "Practice" : "Quiz"}
          </Typography>
          <Stack alignItems="center" direction="row" spacing={1}>
            <IconButton size="lg" component="a" href={userGuideUrl}>
              <HelpOutline />
            </IconButton>
            <ModeToggle />
            <IconButton size="lg" component={RouterLink} to="/config">
              <Settings />
            </IconButton>
          </Stack>
        </Stack>
        <Typography level="h4" component="pre">
          {state.mode.kind === "quiz"
            ? `Lives Remaining: ${config.quizLives - state.mode.mistakesMade}/${
                config.quizLives
              }`
            : " "}
        </Typography>
        <Stack direction="column" alignItems="center">
          <Typography component="pre">{displayKeycut(state.keycut)}</Typography>
          <Stack direction="row" alignItems="center" justifyContent="center">
            <Typography component="pre" fontFamily="monospace" fontSize={64}>
              {config.showPreviousDigits
                ? shownPi.left
                : " ".repeat(config.showExtraDigitsCount)}
            </Typography>
            <Typography
              color="primary"
              component="pre"
              fontFamily="monospace"
              fontSize={64}
            >
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
          <Typography fontSize={18} pt={4}>
            {focused ? "" : "Click to focus"}
          </Typography>
        </Stack>
      </Sheet>
    </div>
  );
};
