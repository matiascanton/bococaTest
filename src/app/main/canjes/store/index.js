import { combineReducers } from "@reduxjs/toolkit";

import canjes from "./canjesSlice";
import canje from "./canjeSlice";

const reducer = combineReducers({
  canjes,
  canje,
});

export default reducer;
