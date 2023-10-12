import { match } from "ts-pattern";
import { Digit } from "./types";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";

export const throwIfNone = <T>(opt: O.Option<T>) =>
  pipe(
    opt,
    O.getOrElse<T>(() => {
      throw Error();
    })
  );

export const stringToDigit = (str: string): O.Option<Digit> =>
  match(str)
    .with("0", () => O.some<Digit>(0))
    .with("1", () => O.some<Digit>(1))
    .with("2", () => O.some<Digit>(2))
    .with("3", () => O.some<Digit>(3))
    .with("4", () => O.some<Digit>(4))
    .with("5", () => O.some<Digit>(5))
    .with("6", () => O.some<Digit>(6))
    .with("7", () => O.some<Digit>(7))
    .with("8", () => O.some<Digit>(8))
    .with("9", () => O.some<Digit>(9))
    .otherwise(() => O.none);
