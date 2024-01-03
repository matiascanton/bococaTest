import { combineReducers } from "@reduxjs/toolkit";

import brands from "./brandsSlice";
import brand from "./brandSlice";

const reducer = combineReducers({
  brands,
  brand,
});

export default reducer;
