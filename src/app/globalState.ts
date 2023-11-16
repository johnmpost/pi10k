import { pipe } from "fp-ts/lib/function";
import { createContextualReactogen } from "./createContextualReactogen";
import { Config, GlobalAction, GlobalState } from "./types";
import { ActionHandler } from "./useReactogen";
import { getLocalStorage, delay, setLocalStorage } from "./pureUtils";
import { O } from "../exports";
import { match } from "ts-pattern";
import { localStorageConfigKey } from "./constants";

const defaultConfig = {
  showExtraDigitsCount: 4,
  quizLives: 3,
  showPreviousDigits: true,
};

const initialConfig = pipe(
  getLocalStorage(Config)(localStorageConfigKey),
  O.getOrElse(delay(defaultConfig))
);

const initialState: GlobalState = {
  config: initialConfig,
};

const handleAction: ActionHandler<GlobalState, GlobalAction> =
  (setState) => (action) => (_) =>
    match(action)
      .with({ kind: "setConfig" }, ({ newConfig }) => () => {
        setState((_) => ({ config: newConfig }));
        setLocalStorage(localStorageConfigKey)(newConfig);
      })
      .exhaustive();

export const {
  Provider: GlobalReactogenProvider,
  useState: useGlobalState,
  useInvoke: useGlobalInvoke,
} = createContextualReactogen(initialState, handleAction);
