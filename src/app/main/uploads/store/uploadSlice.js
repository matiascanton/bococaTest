import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";


export const addFile = createAsyncThunk(
  "uploadsApp/upload/addFile",
  async (fileData, { dispatch, getState }) => {
    console.log('fileData', fileData)
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/files",
      fileData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const processFile = createAsyncThunk(
  "uploadsApp/upload/processFile",
  async (fileData, { dispatch, getState }) => {
    console.log('fileData', fileData)
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/process/upload_file",
      fileData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);




const uploadSlice = createSlice({
  name: "uploadsApp/upload",
  initialState: {
    upload: { enabled: true },
  },
  reducers: {
    resetUpload: () => null,
    newUpload: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          enabled: true,
        },
      }),
    },
    setUpload: {
      reducer: (state, action) => action.payload,
    },
  },
});

export const { resetUpload, newUpload, setUpload } = uploadSlice.actions;

export const selectUpload = ({ uploadsApp }) => uploadsApp.upload;

export default uploadSlice.reducer;
