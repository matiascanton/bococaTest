import { combineReducers } from "@reduxjs/toolkit";

import checkPhotos from "./checkPhotosSlice";
import checkPhoto from "./checkPhotoSlice";

const reducer = combineReducers({
  checkPhotos,
  checkPhoto,
});

export default reducer;
