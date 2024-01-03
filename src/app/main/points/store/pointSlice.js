import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const addPoint = createAsyncThunk(
  "pointsApp/point/addPoint",
  async (pointData, { dispatch, getState }) => {
    console.log('pointData a guardar', pointData)
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/manual_points",
      { ...pointData },
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    console.log('dataaaaaa', data)
    return data;
  }
);


const pointSlice = createSlice({
  name: "pointsApp/point",
  initialState: {
    point: { client_id: [], channel: null, gec: null, description: '' },
  },
  reducers: {
    resetPoint: () => null,
    newPoint: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          client_id: [], channel: null, gec: null, description: '',
        },
      }),
    },
    setPoint: {
      reducer: (state, action) => action.payload,
    },
  },
  extraReducers: {
    [addPoint.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetPoint, newPoint, setPoint } = pointSlice.actions;

export const selectPoint = ({ pointsApp }) => pointsApp.point;

export default pointSlice.reducer;
