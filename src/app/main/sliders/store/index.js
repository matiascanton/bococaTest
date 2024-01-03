import { combineReducers } from "@reduxjs/toolkit";

import sliders from "./slidersSlice";
import slider from "./sliderSlice";

const reducer = combineReducers({
  sliders,
  slider,
});

export default reducer;
