import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";


export const getCheckPhotos = createAsyncThunk(
  "checkPhotosApp/getCheckPhotos",
  async () => {
    const response = await axios.get(BASE_URL + API_VERSION3 + "/back/checkPhotos", {
      headers: { Authorization: TOKEN },
    });
    const data = await response.data;
    data.reverse();
    return data;
  }
);

export const getVariables = createAsyncThunk("checkPhotosApp/getVariables", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/variables", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

const checkPhotosAdapter = createEntityAdapter({});

export const { selectAll: selectCheckPhotos, selectById: selectCheckPhotoById } =
  checkPhotosAdapter.getSelectors((state) => state.checkPhotosApp.checkPhotos);

const checkPhotosSlice = createSlice({
  name: "checkPhotosApp",
  initialState: checkPhotosAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    setCheckPhotosSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getCheckPhotos.fulfilled]: checkPhotosAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setCheckPhotosSearchText } = checkPhotosSlice.actions;

export const selectCheckPhotosSearchText = ({ checkPhotosApp }) =>
  checkPhotosApp.checkPhotos.searchText;

export default checkPhotosSlice.reducer;
