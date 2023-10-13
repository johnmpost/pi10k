import { Digit, Goto, KeycutState, Move, SetMark } from "./types";
import * as O from "fp-ts/Option";
import { flow, pipe } from "fp-ts/lib/function";
import * as pi from "./pi";

export const throwIfNone = <T>(opt: O.Option<T>) =>
  pipe(
    opt,
    O.getOrElse<T>(() => {
      throw Error();
    })
  );

const isDigit = /^[0-9]$/.test;

export const stringToDigit = flow(
  O.fromPredicate(isDigit),
  O.map(parseInt),
  O.map((num) => num as Digit)
);

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

// g:g = go to mark
// g:{num} = go to {num} location
export const parseGotoParameters = ({
  parameters,
}: KeycutState): O.Option<Goto> => O.none;

// s:s = set mark at current location
// s:{num} = set mark at {num} location
export const parseSetMarkParameters = ({
  parameters,
}: KeycutState): O.Option<SetMark> => O.none;
