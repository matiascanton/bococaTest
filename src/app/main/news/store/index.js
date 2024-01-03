import { combineReducers } from "@reduxjs/toolkit";

import news from "./newsSlice";
import newsi from "./newSlice"; //singular

const reducer = combineReducers({
  news,
  newsi,
});

export default reducer;
