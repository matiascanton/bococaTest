import { combineReducers } from "@reduxjs/toolkit";

import notifications from "./notificationsSlice";
import notification from "./notificationSlice";

const reducer = combineReducers({
  notifications,
  notification,
});

export default reducer;
