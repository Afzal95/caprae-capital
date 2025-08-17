import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import matchesReducer from "./matchesSlice";
import dealsReducer from "./dealsSlice";
export const store = configureStore({
  reducer: { user: userReducer, matches: matchesReducer, deals: dealsReducer },
});
