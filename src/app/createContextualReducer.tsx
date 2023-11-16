import React, { createContext, useContext, useReducer } from "react";

export const createContextualReducer = <State, Action>(
  initialState: State,
  reduce: (state: State, action: Action) => State
) => {
  const StateContext = createContext<State>(initialState);
  const DispatchContext = createContext<React.Dispatch<Action>>(() => {});

  const Provider = ({ children }: React.PropsWithChildren) => {
    const [state, dispatch] = useReducer(reduce, initialState);

    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          {children}
        </DispatchContext.Provider>
      </StateContext.Provider>
    );
  };

  const useState = () => useContext(StateContext);
  const useDispatch = () => useContext(DispatchContext);

  return { Provider, useState, useDispatch };
};
