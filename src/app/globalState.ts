import { createContextualReducer } from "./createContextualReducer";
import { GlobalAction, GlobalState } from "./types";

const initialState: GlobalState = {
  config: {
    showExtraDigitsCount: 4,
    quizLives: 3,
    showPreviousDigits: true,
  },
};

const reduce = (state: GlobalState, _: GlobalAction) => state;

export const {
  Provider: GlobalStateProvider,
  useState: useGlobalState,
  useDispatch: useGlobalDispatch,
} = createContextualReducer(initialState, reduce);
