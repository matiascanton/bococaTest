import { combineReducers } from "@reduxjs/toolkit";

import prizes from "./prizesSlice";
import prize from "./prizeSlice";

const reducer = combineReducers({
  prizes,
  prize,
});

export default reducer;
