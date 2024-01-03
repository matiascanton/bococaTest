import { combineReducers } from "@reduxjs/toolkit";

import bingos from "./bingosSlice";
import bingo from "./bingoSlice";

const reducer = combineReducers({
  bingos,
  bingo,
});

export default reducer;
