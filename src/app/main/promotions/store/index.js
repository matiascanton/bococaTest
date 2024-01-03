import { combineReducers } from "@reduxjs/toolkit";

import promotions from "./promotionsSlice";
import promotion from "./promotionSlice";

const reducer = combineReducers({
  promotions,
  promotion,
});

export default reducer;
