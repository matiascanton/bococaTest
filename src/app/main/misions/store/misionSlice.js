import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const addMision = createAsyncThunk(
  "misionsApp/mision/addMision",
  async (misionData, { dispatch, getState }) => {
    console.log('misionData a guardar', misionData)
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/monthly_missions",
      misionData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    console.log('dataaaaaa', data)
    return data;
  }
);

export const updateMision = createAsyncThunk(
  "misionsApp/mision/updateMision",
  async (misionData, { dispatch, getState }) => {
    console.log('misionData', misionData)
    const response = await axios.put(
      BASE_URL + API_VERSION3 + `/back/monthly_missions/${misionData.id}`,
      { ...misionData },
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const addFile = createAsyncThunk(
  "misionsApp/mision/addFile",
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

export const removeMision = createAsyncThunk(
  "misionsApp/mision/removeMision",
  async (val, { dispatch, getState }) => {
    console.log('deleteeeeeee', val)
    await axios.delete(BASE_URL + API_VERSION3 + `/back/monthly_missions/${val}`,
      { headers: { Authorization: TOKEN } });
    return id;
  }
);

export const getOneMision = createAsyncThunk(
  "misionsApp/mision/getOneMision",
  async (val, { dispatch, getState }) => {
    console.log('vaaaal', val)
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/monthly_missions/${val.id}`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    console.log('dataaaaaa', data)
    return data;
  }
);

const misionSlice = createSlice({
  name: "misionsApp/mision",
  initialState: {
    mision: { deleted: false, missions: [] },
  },
  reducers: {
    resetMision: () => null,
    newMision: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          deleted: false,
          missions: [],
        },
      }),
    },
    setMision: {
      reducer: (state, action) => action.payload,
    },
  },
  extraReducers: {
    [addMision.fulfilled]: (state, action) => action.payload,
    [updateMision.fulfilled]: (state, action) => action.payload,
    [removeMision.fulfilled]: (state, action) => action.payload,
    [getOneMision.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetMision, newMision, setMision } = misionSlice.actions;

export const selectMision = ({ misionsApp }) => misionsApp.mision;

export default misionSlice.reducer;
