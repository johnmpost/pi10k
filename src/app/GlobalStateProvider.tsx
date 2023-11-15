import { Config } from "./types";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
} from "react";

type GlobalState = { config: Config };

const initialState: GlobalState = {
  config: {
    showExtraDigitsCount: 4,
    allowedQuizMistakes: 3,
    groupings: [],
    showPreviousDigits: true,
  },
};

const reducer = (state: GlobalState) => state;

const StateContext = createContext(initialState);
const DispatchContext = createContext(() => {});

export const GlobalStateProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export const useGlobalState = () => useContext(StateContext);
export const useGlobalDispatch = () => useContext(DispatchContext);
