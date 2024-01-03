import { combineReducers } from "@reduxjs/toolkit";

import points from "./pointsSlice";
import point from "./pointSlice";

const reducer = combineReducers({
  points,
  point,
});

export default reducer;
