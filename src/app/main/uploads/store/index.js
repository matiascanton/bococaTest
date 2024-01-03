import { combineReducers } from "@reduxjs/toolkit";

import uploads from "./uploadsSlice";
import upload from "./uploadSlice";

const reducer = combineReducers({
  uploads,
  upload,
});

export default reducer;
