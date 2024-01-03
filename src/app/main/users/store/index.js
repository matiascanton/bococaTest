import { combineReducers } from "@reduxjs/toolkit";

import users from "./usersSlice";
import user from "./userSlice";

const reducer = combineReducers({
  users,
  user,
});

export default reducer;
