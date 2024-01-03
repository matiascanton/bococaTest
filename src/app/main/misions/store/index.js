import { combineReducers } from "@reduxjs/toolkit";

import misions from "./misionsSlice";
import mision from "./misionSlice";

const reducer = combineReducers({
  misions,
  mision,
});

export default reducer;
