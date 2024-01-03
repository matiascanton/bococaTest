import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const addTricampeon = createAsyncThunk(
  "tricampeonsApp/tricampeon/addTricampeon",
  async (tricampeonData, { dispatch, getState }) => {
    console.log('tricampeonData a guardar', tricampeonData)
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/competences",
      { ...tricampeonData },
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    console.log('dataaaaaa', data)
    return data;
  }
);

export const updateTricampeon = createAsyncThunk(
  "tricampeonsApp/tricampeon/updateTricampeon",
  async (tricampeonData, { dispatch, getState }) => {
    console.log('tricampeonData', tricampeonData)
    const response = await axios.put(
      BASE_URL + API_VERSION3 + "/back/competences",
      { ...tricampeonData },
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const addFile = createAsyncThunk(
  "tricampeonsApp/tricampeon/addFile",
  async (fileData, { dispatch, getState }) => {
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/files",
      { ...fileData },
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const removeTricampeon = createAsyncThunk(
  "tricampeonsApp/tricampeon/removeTricampeon",
  async (val, { dispatch, getState }) => {
    console.log('deleteeeeeee', val)
    await axios.delete(BASE_URL + API_VERSION3 + `/back/competences/${val}`,
      { headers: { Authorization: TOKEN } });
    return id;
  }
);

const tricampeonSlice = createSlice({
  name: "tricampeonsApp/tricampeon",
  initialState: {
    tricampeon: {
      enabled: true,
      name: '',
      type: '',
      start_date: '',
      due_date: '',
      terms: '',
      gift_1: '',
      gift_2: '',
      skus_1: '',
      skus_2: '',
      skus_3: '',
      skus_4: ''
    },
  },
  reducers: {
    resetTricampeon: () => null,
    newTricampeon: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          enabled: true,
          name: '',
          type: '',
          start_date: '',
          due_date: '',
          terms: '',
          gift_1: '',
          gift_2: '',
          skus_1: '',
          skus_2: '',
          skus_3: '',
          skus_4: ''
        },
      }),
    },
    setTricampeon: {
      reducer: (state, action) => action.payload,
    },
  },
  extraReducers: {
    [addTricampeon.fulfilled]: (state, action) => action.payload,
    [updateTricampeon.fulfilled]: (state, action) => action.payload,
    [removeTricampeon.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetTricampeon, newTricampeon, setTricampeon } = tricampeonSlice.actions;

export const selectTricampeon = ({ tricampeonsApp }) => tricampeonsApp.tricampeon;

export default tricampeonSlice.reducer;
