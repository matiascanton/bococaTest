import { combineReducers } from "@reduxjs/toolkit";

import stocks from "./stocksSlice";
import stock from "./stockSlice";

const reducer = combineReducers({
  stocks,
  stock,
});

export default reducer;
