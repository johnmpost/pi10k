import { Digit } from "./types";
import * as O from "fp-ts/Option";
import { flow, pipe } from "fp-ts/lib/function";

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
