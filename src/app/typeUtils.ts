import { boolean, number } from "fp-ts";
import { Eq } from "../exports";
import { Config } from "./types";

export const eqConfig: Eq.Eq<Config> = Eq.struct({
  quizLives: number.Eq,
  showExtraDigitsCount: number.Eq,
  showPreviousDigits: boolean.Eq,
});
