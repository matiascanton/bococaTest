import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const addCoupon = createAsyncThunk(
  "couponsApp/coupon/addCoupon",
  async (couponData, { dispatch, getState }) => {
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/promotions/coupons",
      couponData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const updateCoupon = createAsyncThunk(
  "couponsApp/coupon/updateCoupon",
  async (couponData, { dispatch, getState }) => {
    const response = await axios.put(
      BASE_URL + API_VERSION3 + "/back/promotions/coupons",
      couponData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

const couponSlice = createSlice({
  name: "couponsApp/coupon",
  initialState: {
    coupon: { img_brief: "", img_description: "", enabled: false },
  },
  reducers: {
    resetCoupon: () => null,
    newCoupon: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          img_brief: "",
          img_description: "",
          enabled: false,
        },
      }),
    },
    setCoupon: {
      reducer: (state, action) => action.payload,
    },
  },
  extraReducers: {
    [addCoupon.fulfilled]: (state, action) => action.payload,
    [updateCoupon.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetCoupon, newCoupon, setCoupon } = couponSlice.actions;

export const selectCoupon = ({ couponsApp }) => couponsApp.coupon;

export default couponSlice.reducer;
