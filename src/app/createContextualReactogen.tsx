import React, { createContext, useContext } from "react";
import { ActionHandler, useReactogen } from "./useReactogen";

export const createContextualReactogen = <State, Action>(
  initialState: State,
  handleAction: ActionHandler<State, Action>
) => {
  const StateContext = createContext<State>(initialState);
  const InvokeContext = createContext((_: Action) => {});

  const Provider = ({ children }: React.PropsWithChildren) => {
    const { state, invoke } = useReactogen(initialState, handleAction);

    return (
      <StateContext.Provider value={state}>
        <InvokeContext.Provider value={invoke}>
          {children}
        </InvokeContext.Provider>
      </StateContext.Provider>
    );
  };

  const useState = () => useContext(StateContext);
  const useInvoke = () => useContext(InvokeContext);

  return { Provider, useState, useInvoke };
};
