import { createSlice } from "@reduxjs/toolkit";

export type AppState = {};

const initialState: AppState = {};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
});

export const {} = appSlice;
export const reducer = appSlice.reducer;
