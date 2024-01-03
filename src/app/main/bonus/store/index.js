import { combineReducers } from "@reduxjs/toolkit";

import bonuses from "./bonusesSlice";
import bonus from "./bonusSlice";

const reducer = combineReducers({
  bonuses,
  bonus,
});

export default reducer;
