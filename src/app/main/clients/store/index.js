import { combineReducers } from "@reduxjs/toolkit";

import clients from "./clientsSlice";
import client from "./clientSlice";

const reducer = combineReducers({
  clients,
  client,
});

export default reducer;
