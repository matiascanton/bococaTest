import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const addPromotion = createAsyncThunk(
  "promotionsApp/promotion/addPromotion",
  async (promotionData, { dispatch, getState }) => {
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/promotions/coupons",
      promotionData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const updatePromotion = createAsyncThunk(
  "promotionsApp/promotion/updatePromotion",
  async (promotionData, { dispatch, getState }) => {
    const response = await axios.put(
      BASE_URL + API_VERSION3 + "/back/promotions/coupons",
      promotionData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

const promotionSlice = createSlice({
  name: "promotionsApp/promotion",
  initialState: {
    promotion: { img_brief: "", img_description: "", enabled: false },
  },
  reducers: {
    resetPromotion: () => null,
    newPromotion: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          img_brief: "",
          img_description: "",
          enabled: false,
        },
      }),
    },
    setPromotion: {
      reducer: (state, action) => action.payload,
    },
  },
  extraReducers: {
    [addPromotion.fulfilled]: (state, action) => action.payload,
    [updatePromotion.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetPromotion, newPromotion, setPromotion } = promotionSlice.actions;

export const selectPromotion = ({ promotionsApp }) => promotionsApp.promotion;

export default promotionSlice.reducer;
