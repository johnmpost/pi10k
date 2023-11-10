import { match } from "ts-pattern";
import {
  hotkeys,
  gotoMarkParam,
  setMarkCurrentLocationParam,
} from "./constants";
import {
  Digit,
  StatefulKeycut,
  KeycutState,
  Goto,
  SetMark,
  PiState,
} from "./types";
import * as pi from "./piDigits";
import { O } from "../fp-ts-exports";
import { isPositiveInt, regexTest, toString } from "./pureUtils";

export const statefulKeycutToString = (keycut: StatefulKeycut) =>
  match(keycut)
    .with("goto", () => hotkeys.startGotoKeycut)
    .with("setMark", () => hotkeys.startSetMarkKeycut)
    .exhaustive();

export const quizHasFailed =
  (mistakesMade: number) => (mistakesAllowed: number) =>
    mistakesMade > mistakesAllowed;

export const nextDigitIsCorrect = (
  currLocation: number,
  attemptedDigit: Digit
) => {
  const nextLocation = currLocation + 1;
  const expectedNextDigit = pi.digits[nextLocation];
  const digitIsCorrect = attemptedDigit === expectedNextDigit;
  return digitIsCorrect;
};

export const locationInBounds = (location: number) =>
  location >= 0 && location < pi.digits.length;

const isMark = regexTest(gotoMarkParam);
const isLocation = (str: string) =>
  isPositiveInt(str) && locationInBounds(parseInt(str));

export const parseGotoParameters = ({
  parameters,
}: KeycutState): O.Option<Goto> =>
  match(parameters)
    .when(isMark, () => O.some({ location: { kind: "mark" as const } }))
    .when(isLocation, () =>
      O.some({
        location: { kind: "location" as const, location: parseInt(parameters) },
      })
    )
    .otherwise(() => O.none);

const isCurrentLocation = regexTest(setMarkCurrentLocationParam);

export const parseSetMarkParameters = ({
  parameters,
}: KeycutState): O.Option<SetMark> =>
  match(parameters)
    .when(isCurrentLocation, () =>
      O.some({ location: { kind: "currentLocation" as const } })
    )
    .when(isLocation, () =>
      O.some({
        location: {
          kind: "atLocation" as const,
          location: parseInt(parameters),
        },
      })
    )
    .otherwise(() => O.none);

export const showPi = (
  location: number,
  showExtraDigitsCount: number,
  digits: Digit[]
) => {
  const padding = " ".repeat(showExtraDigitsCount).split("");
  const paddedDigits = [...padding, ...digits.map(toString), ...padding];
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

export const getCurrLocation = (state: PiState) =>
  match(state.mode)
    .with({ kind: "practice" }, () => state.practice.currLocation)
    .with({ kind: "quiz" }, ({ currLocation }) => currLocation)
    .exhaustive();

export const displayKeycut = O.match<KeycutState, string>(
  () => " ",
  (keycut) => `${statefulKeycutToString(keycut.kind)}:${keycut.parameters}`
);
