import { combineReducers } from "@reduxjs/toolkit";

import marketers from "./marketersSlice";

const reducer = combineReducers({
  marketers,
});

export default reducer;
