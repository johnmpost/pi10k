import { O } from "../fp-ts-exports";
import { flow, pipe } from "fp-ts/lib/function";
import { match } from "ts-pattern";
import { hotkeys } from "./constants";
import { gotoMarkParam, setMarkCurrentLocationParam } from "./constants";
import { Digit, StatefulKeycut, KeycutState, Goto, SetMark } from "./types";
import * as pi from "./piDigits";

export const throwIfNone = <T>(opt: O.Option<T>) =>
  pipe(
    opt,
    O.getOrElse<T>(() => {
      throw Error();
    })
  );

export const isDigit = (str: string) => /^[0-9]$/.test(str);

export const isOneCharacter = (str: string) => /^.$/.test(str);

export const stringToDigit = flow(
  O.fromPredicate(isDigit),
  O.map(parseInt),
  O.map((num) => num as Digit)
);

export const backspace = (str: string) =>
  str.length === 0 ? str : str.substring(0, str.length - 1);

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

const isMark = (str: string) => gotoMarkParam.test(str);
const isPositiveInt = (str: string) => /^[0-9]*$/.test(str);
const isInRange = (num: number) => num <= pi.digits.length - 1;
const isLocation = (str: string) =>
  isPositiveInt(str) && isInRange(parseInt(str));

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

const isCurrentLocation = (str: string) =>
  setMarkCurrentLocationParam.test(str);

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
