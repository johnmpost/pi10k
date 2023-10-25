import { flow } from "fp-ts/lib/function";
import { stringToDigit, unsafeUnwrap } from "./pureUtils";

export const digits = "31415926535897932384626433832795028841971693993751"
  .split("")
  .map(flow(stringToDigit, unsafeUnwrap));
