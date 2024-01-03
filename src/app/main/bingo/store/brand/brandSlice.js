import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_VERSION, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const addBrand = createAsyncThunk(
  "brandsApp/brand/addBrand",
  async (bingoData, { dispatch, getState }) => {
    const response = await axios.post(
      BASE_URL + API_VERSION + "/back/brands",
      brandData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

const brandSlice = createSlice({
  name: "brandsApp/brand",
  initialState: null,
  reducers: {
    resetBrand: () => null,
  },
  extraReducers: {
    [getBrand.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetBrand } = bingoSlice.actions;

export const selectBrand = ({ brandsApp }) => brandsApp.brand;

export default brandSlice.reducer;
