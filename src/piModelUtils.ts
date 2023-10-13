import { match } from "ts-pattern";
import { gotoMarkParam, setMarkCurrentLocationParam } from "./constants";
import { Digit, KeycutState, Goto, SetMark } from "./types";
import * as pi from "./pi";
import * as O from "fp-ts/Option";

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

const isMark = gotoMarkParam.test;
const isPositiveInt = /^[0-9]*$/.test;
const isInRange = (num: number) => num <= pi.maxLocation;
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

const isCurrentLocation = setMarkCurrentLocationParam.test;

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
