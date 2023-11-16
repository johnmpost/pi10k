import { pipe } from "fp-ts/lib/function";
import { createContextualReactogen } from "./createContextualReactogen";
import { Config, GlobalAction, GlobalState } from "./types";
import { ActionHandler } from "./useReactogen";
import { getLocalStorage, delay } from "./pureUtils";
import { O } from "../exports";

const defaultConfig = {
  showExtraDigitsCount: 4,
  quizLives: 3,
  showPreviousDigits: true,
};

const initialConfig = pipe(
  getLocalStorage(Config)(""),
  O.getOrElse(delay(defaultConfig))
);

const initialState: GlobalState = {
  config: initialConfig,
};

const handleAction: ActionHandler<GlobalState, GlobalAction> =
  (_) => (_) => (_) => () => {};

export const {
  Provider: GlobalReactogenProvider,
  useState: useGlobalState,
  useInvoke: useGlobalInvoke,
} = createContextualReactogen(initialState, handleAction);
