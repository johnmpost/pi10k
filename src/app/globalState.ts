import { createContextualReactogen } from "./createContextualReactogen";
import { GlobalAction, GlobalState } from "./types";
import { ActionHandler } from "./useReactogen";

const initialState: GlobalState = {
  config: {
    showExtraDigitsCount: 4,
    quizLives: 3,
    showPreviousDigits: true,
  },
};

const handleAction: ActionHandler<GlobalState, GlobalAction> =
  (_) => (_) => (_) => () => {};

export const {
  Provider: GlobalReactogenProvider,
  useState: useGlobalState,
  useInvoke: useGlobalInvoke,
} = createContextualReactogen(initialState, handleAction);
