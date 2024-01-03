import { combineReducers } from "@reduxjs/toolkit";

import tricampeons from "./tricampeonsSlice";
import tricampeon from "./tricampeonSlice";

const reducer = combineReducers({
  tricampeons,
  tricampeon,
});

export default reducer;
