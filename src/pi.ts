import { flow } from "fp-ts/lib/function";
import { Digit } from "./types";
import { stringToDigit, throwIfNone } from "./utils";

export const digits: Digit[] =
  "31415926535897932384626433832795028841971693993751"
    .split("")
    .map(flow(stringToDigit, throwIfNone));
