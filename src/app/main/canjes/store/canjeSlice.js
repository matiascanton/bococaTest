import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const addCanje = createAsyncThunk(
  "canjesApp/canje/addCanje",
  async (canjeData, { dispatch, getState }) => {
    console.log('canjeData a guardar', canjeData)
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/manual_exchanges",
      { ...canjeData },
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    console.log('dataaaaaa', data)
    return data;
  }
);

/*export const updateCanje = createAsyncThunk(
  "canjesApp/canje/updateCanje",
  async (canjeData, { dispatch, getState }) => {
    console.log('canjeData', canjeData)
    const response = await axios.put(
      BASE_URL + API_VERSION3 + "/back/catalogs",
      { ...canjeData },
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);



export const removeCanje = createAsyncThunk(
  "canjesApp/canje/removeCanje",
  async (val, { dispatch, getState }) => {
    console.log('deleteeeeeee', val)
    await axios.delete(BASE_URL + API_VERSION3 + `/back/catalogs/${val}`,
      { headers: { Authorization: TOKEN } });
    return id;
  }
);*/

const canjeSlice = createSlice({
  name: "canjesApp/canje",
  initialState: {
    canje: { title: "", qty: null, },
  },
  reducers: {
    resetCanje: () => null,
    newCanje: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          title: "",
          qty: null,
        },
      }),
    },
    setCanje: {
      reducer: (state, action) => action.payload,
    },
  },
  extraReducers: {
    [addCanje.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetCanje, newCanje, setCanje } = canjeSlice.actions;

export const selectCanje = ({ canjesApp }) => canjesApp.canje;

export default canjeSlice.reducer;
