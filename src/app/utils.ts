import { Digit, StatefulKeycut } from "./types";
import * as O from "fp-ts/Option";
import { flow, pipe } from "fp-ts/lib/function";
import { match } from "ts-pattern";
import { hotkeys } from "./constants";

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
