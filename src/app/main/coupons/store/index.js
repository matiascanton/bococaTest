import { combineReducers } from "@reduxjs/toolkit";

import coupons from "./couponsSlice";
import coupon from "./couponSlice";

const reducer = combineReducers({
  coupons,
  coupon,
});

export default reducer;
