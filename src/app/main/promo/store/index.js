import { combineReducers } from "@reduxjs/toolkit";

import promo from "./promoSlice";

const reducer = combineReducers({
  promo,
});

export default reducer;
