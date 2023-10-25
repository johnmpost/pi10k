import { O } from "../fp-ts-exports";
import { flow, pipe } from "fp-ts/lib/function";
import { Digit } from "./types";

export const unsafeUnwrap = <T>(opt: O.Option<T>) =>
  pipe(
    opt,
    O.getOrElse<T>(() => {
      throw Error(
        "Expected Some, got None. This function should only be used when you are certain the value is Some."
      );
    })
  );

export const regexTest = (regex: RegExp) => (str: string) => regex.test(str);
export const isDigit = regexTest(/^[0-9]$/);
export const isOneCharacter = regexTest(/^.$/);

export const stringToDigit = flow(
  O.fromPredicate(isDigit),
  O.map(parseInt),
  O.map((num) => num as Digit)
);

export const backspace = (str: string) =>
  str.length === 0 ? str : str.substring(0, str.length - 1);