import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getUploads = createAsyncThunk(
  "uploadsApp/getUploads",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/competences`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    return data;
  }
);
export const getVariables = createAsyncThunk(
  "uploadsApp/getVariables",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + "/back/competences/variables",
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    return data;
  }
);

export const getUploadedFiles = createAsyncThunk(
  "uploadsApp/getUploadedFiles",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + "/back/process/uploaded_files",
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    return data;
  }
);




const uploadsAdapter = createEntityAdapter({});

export const { selectAll: selectUploads, selectById: selectUploadById } =
  uploadsAdapter.getSelectors((state) => state.uploadsApp.uploads);

const uploadsSlice = createSlice({
  name: "uploadsApp",
  initialState: uploadsAdapter.getInitialState({
    searchText: "",
    variables: [],
  }),
  reducers: {
    setUploadsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getUploads.fulfilled]: uploadsAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
    [getUploadedFiles.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },

  },
});

export const { setUploadsSearchText } = uploadsSlice.actions;

export const selectUploadsSearchText = ({ uploadsApp }) =>
  uploadsApp.uploads.searchText;
export const selectVariables = ({ uploadsApp }) => uploadsApp.uploads.variables;

export default uploadsSlice.reducer;
