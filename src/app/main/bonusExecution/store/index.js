import { combineReducers } from "@reduxjs/toolkit";

import bonusExecutions from "./bonusExecutionsSlice";
import bonusExecution from "./bonusExecutionSlice";

const reducer = combineReducers({
  bonusExecutions,
  bonusExecution,
});

export default reducer;
