import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { createSlice } from "@reduxjs/toolkit";
import { Config } from "./types";

type GlobalState = { config: Config };

const initialState: GlobalState = {
  config: {
    showExtraDigitsCount: 4,
    allowedQuizMistakes: 3,
    groupings: [],
    showPreviousDigits: true,
  },
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
});

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
  middleware: (defaultMiddleware) => defaultMiddleware(),
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
export const useGlobalDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useGlobalSelector: TypedUseSelectorHook<RootState> = useSelector;
