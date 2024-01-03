import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const addImperdible = createAsyncThunk(
  "imperdiblesApp/imperdible/addImperdible",
  async (imperdibleData, { dispatch, getState }) => {
    console.log('imperdibleData a guardar', imperdibleData)
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/imperdibles",
      imperdibleData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    console.log('dataaaaaa', data)
    return data;
  }
);

export const updateImperdible = createAsyncThunk(
  "imperdiblesApp/imperdible/updateImperdible",
  async (imperdibleData, { dispatch, getState }) => {
    console.log('imperdibleData', imperdibleData)
    const response = await axios.put(
      BASE_URL + API_VERSION3 + `/back/imperdibles/${imperdibleData.id}`,
      { ...imperdibleData },
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const addFile = createAsyncThunk(
  "imperdiblesApp/imperdible/addFile",
  async (fileData, { dispatch, getState }) => {

    console.log('fileeeeeeeeeeeee', fileData)
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/files",
      fileData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;

    return data;
  }
);

export const getOneImperdibles = createAsyncThunk(
  "imperdiblesApp/imperdible/getOneImperdibles",
  async (val, { dispatch, getState }) => {
    console.log('vaaaal', val)
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/imperdibles/${val.id}`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    return data;
  }
);

export const removeImperdible = createAsyncThunk(
  "imperdiblesApp/imperdible/removeImperdible",
  async (val, { dispatch, getState }) => {
    console.log('deleteeeeeee', val)
    await axios.delete(BASE_URL + API_VERSION3 + `/back/imperdibles/${val}`,
      { headers: { Authorization: TOKEN } });
    return id;
  }
);

const imperdibleSlice = createSlice({
  name: "imperdiblesApp/imperdible",
  initialState: {
    imperdible: { deleted: false, items: [] },
  },
  reducers: {
    resetImperdible: () => null,
    newImperdible: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          deleted: false,
          items: [],
        },
      }),
    },
    setImperdible: {
      reducer: (state, action) => action.payload,
    },
  },
  extraReducers: {
    [addImperdible.fulfilled]: (state, action) => action.payload,
    [updateImperdible.fulfilled]: (state, action) => action.payload,
    [removeImperdible.fulfilled]: (state, action) => action.payload,
    [getOneImperdibles.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetImperdible, newImperdible, setImperdible } = imperdibleSlice.actions;

export const selectImperdible = ({ imperdiblesApp }) => imperdiblesApp.imperdible;

export default imperdibleSlice.reducer;
