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
  (setState) => (action) => (previousState) =>
    match(action)
      .with({ kind: "setConfig" }, ({ setState: setState2 }) => () => {
        const newConfig = setState2(previousState.config);
        setState(() => ({ config: newConfig }));
        setLocalStorage(localStorageConfigKey)(newConfig);
      })
      .exhaustive();

export const {
  Provider: GlobalReactogenProvider,
  useState: useGlobalState,
  useInvoke: useGlobalInvoke,
} = createContextualReactogen(initialState, handleAction);
