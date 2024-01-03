import { combineReducers } from "@reduxjs/toolkit";

import users from "./rolesSlice";
import user from "./roleSlice";

const reducer = combineReducers({
  users,
  user,
});

export default reducer;
