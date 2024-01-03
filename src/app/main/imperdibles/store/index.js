import { combineReducers } from "@reduxjs/toolkit";

import imperdibles from "./imperdiblesSlice";
import imperdible from "./imperdibleSlice";

const reducer = combineReducers({
  imperdibles,
  imperdible,
});

export default reducer;
