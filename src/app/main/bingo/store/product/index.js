import { combineReducers } from "@reduxjs/toolkit";

import products from "./productsSlice";
import product from "./productSlice";

const reducer = combineReducers({
  products,
  product,
});

export default reducer;
