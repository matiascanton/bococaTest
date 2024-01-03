import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const addPrize = createAsyncThunk(
  "prizesApp/prize/addPrize",
  async (prizeData, { dispatch, getState }) => {
    console.log('prizeData a guardar', prizeData)
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/catalogs",
      { ...prizeData },
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    console.log('dataaaaaa', data)
    return data;
  }
);

export const updatePrize = createAsyncThunk(
  "prizesApp/prize/updatePrize",
  async (prizeData, { dispatch, getState }) => {
    console.log('prizeData', prizeData)
    const response = await axios.put(
      BASE_URL + API_VERSION3 + "/back/catalogs",
      { ...prizeData },
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);



export const removePrize = createAsyncThunk(
  "prizesApp/prize/removePrize",
  async (val, { dispatch, getState }) => {
    console.log('deleteeeeeee', val)
    await axios.delete(BASE_URL + API_VERSION3 + `/back/catalogs/${val}`,
      { headers: { Authorization: TOKEN } });
    return id;
  }
);

const prizeSlice = createSlice({
  name: "prizesApp/prize",
  initialState: {
    prize: { sku: null, points: null, },
  },
  reducers: {
    resetPrize: () => null,
    newPrize: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          sku: null,
          points: null,
        },
      }),
    },
    setPrize: {
      reducer: (state, action) => action.payload,
    },
  },
  extraReducers: {
    [addPrize.fulfilled]: (state, action) => action.payload,
    [updatePrize.fulfilled]: (state, action) => action.payload,
    [removePrize.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetPrize, newPrize, setPrize } = prizeSlice.actions;

export const selectPrize = ({ prizesApp }) => prizesApp.prize;

export default prizeSlice.reducer;
