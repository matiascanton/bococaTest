import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getCoupons = createAsyncThunk(
  "couponsApp/getCoupons",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + "/back/promotions/coupons",
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    data.reverse()
    return data;
  }
);

export const getVariables = createAsyncThunk("couponsApp/getVariables", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/variables", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

const couponsAdapter = createEntityAdapter({});

export const { selectAll: selectCoupons, selectById: selectCouponById } =
  couponsAdapter.getSelectors((state) => state.couponsApp.coupons);

const couponsSlice = createSlice({
  name: "couponsApp",
  initialState: couponsAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    setCouponsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getCoupons.fulfilled]: couponsAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setCouponsSearchText } = couponsSlice.actions;
export const selectCouponsSearchText = ({ couponsApp }) =>
  couponsApp.coupons.searchText;

export default couponsSlice.reducer;
