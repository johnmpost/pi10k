import { O, t } from "../exports";
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
export const isPositiveInt = regexTest(/^[0-9]*$/);

export const stringToDigit = flow(
  O.fromPredicate(isDigit),
  O.map(parseInt),
  O.map((num) => num as Digit)
);

export const backspace = (str: string) =>
  str.length === 0 ? str : str.substring(0, str.length - 1);

export const toString = <T extends { toString(): string }>(value: T) =>
  value.toString();

export const doNothing = () => {};

export const delay =
  <T>(x: T) =>
  () =>
    x;

const localStorageSetItem = (key: string) => (value: string) =>
  localStorage.setItem(key, value);

const localStorageGetItem = (key: string) =>
  O.fromNullable(localStorage.getItem(key));

export const setLocalStorage = (key: string) =>
  flow(JSON.stringify, localStorageSetItem(key));

export const getLocalStorage = <T>(codec: t.Type<T>) =>
  flow(
    localStorageGetItem,
    O.map(O.tryCatchK(JSON.parse)),
    O.fromEitherK(codec.decode)
  );
