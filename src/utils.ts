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

const isDigit = (str: string) => /^[0-9]$/.test(str);

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

export const parseGotoParameters = ({
  parameters,
}: KeycutState): O.Option<Goto> => O.none;

export const parseMoveParameters = ({
  parameters,
}: KeycutState): O.Option<Move> => O.none;

export const parseSetMarkParameters = ({
  parameters,
}: KeycutState): O.Option<SetMark> => O.none;
