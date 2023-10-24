import { Sheet, Stack, Typography } from "@mui/joy";
import { usePiReducer } from "./piModel";
import { handleKeypress } from "./piKeypressHandler";
import { Digit, KeycutState, PiState } from "./types";
import * as pi from "./pi";
import { useGlobalSelector } from "./globalState";
import { match } from "ts-pattern";
import * as O from "fp-ts/Option";
import { statefulKeycutToString } from "./utils";

const showPi = (
  location: number,
  showExtraDigitsCount: number,
  digits: Digit[]
) => {
  const padding = " ".repeat(showExtraDigitsCount).split("");
  const paddedDigits = [
    ...padding,
    ...digits.map((x) => x.toString()),
    ...padding,
  ];
  const adjustedCenter = location + showExtraDigitsCount;
  return {
    left: paddedDigits.slice(
      adjustedCenter - showExtraDigitsCount,
      adjustedCenter
    ),
    center: paddedDigits[location + showExtraDigitsCount],
    right: paddedDigits.slice(
      adjustedCenter + 1,
      adjustedCenter + showExtraDigitsCount + 1
    ),
  };
};

const getCurrLocation = (state: PiState) =>
  match(state.mode)
    .with({ kind: "practice" }, () => state.practice.currLocation)
    .with({ kind: "quiz" }, ({ currLocation }) => currLocation)
    .exhaustive();

const displayKeycut = O.match<KeycutState, string>(
  () => " ",
  (keycut) => `${statefulKeycutToString(keycut.kind)}:${keycut.parameters}`
);

export const Pi = () => {
  const [state, dispatch] = usePiReducer();
  const showExtraDigitsCount = useGlobalSelector(
    (x) => x.app.config.showExtraDigitsCount
  );
  const shownPi = showPi(
    getCurrLocation(state),
    showExtraDigitsCount,
    pi.digits
  );

  return (
    <div
      style={{ height: "100vh" }}
      onKeyDown={handleKeypress(state, dispatch)}
      tabIndex={-1}
    >
      <Sheet sx={{ height: "100%" }}>
        <Typography>{state.mode.kind}</Typography>
        <Stack direction="column" alignItems="center">
          <Typography component="pre">{displayKeycut(state.keycut)}</Typography>
          <Stack direction="row" alignItems="center" justifyContent="center">
            <Typography component="pre" fontFamily="monospace" fontSize={64}>
              {shownPi.left}
            </Typography>
            <Typography component="pre" fontFamily="monospace" fontSize={64}>
              {shownPi.center}
            </Typography>
            <Typography component="pre" fontFamily="monospace" fontSize={64}>
              {match(state.mode)
                .with({ kind: "practice" }, () =>
                  state.practice.showNextDigits
                    ? shownPi.right
                    : shownPi.right.map((_) => " ")
                )
                .with({ kind: "quiz" }, () => shownPi.right.map((_) => " "))
                .exhaustive()}
            </Typography>
          </Stack>
          <Typography fontSize={24}>{getCurrLocation(state)}</Typography>
        </Stack>
      </Sheet>
    </div>
  );
};
