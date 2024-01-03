import axios from "axios";
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getBingos = createAsyncThunk("bingosApp/getBingos", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/bingos", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  //console.log('data', data)
  data.filter((bingo) => bingo.deleted === false);
  return data;
});

export const getBrands = createAsyncThunk("bingosApp/getBrands", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/brands", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

export const getProducts = createAsyncThunk("bingosApp/getProducts", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/products", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

export const getVariables = createAsyncThunk("bingosApp/getVariables", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/variables", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

const bingosAdapter = createEntityAdapter({});

export const { selectAll: selectBingos, selectById: selectBingoById } =
  bingosAdapter.getSelectors((state) => state.bingosApp.bingos);

const bingosSlice = createSlice({
  name: "bingosApp",
  initialState: bingosAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    setBingosSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getBingos.fulfilled]: bingosAdapter.setAll,
    [getBrands.fulfilled]: bingosAdapter.setAll,
    [getProducts.fulfilled]: bingosAdapter.setAll,
    [getVariables.fulfilled]: bingosAdapter.setAll,

  },
});

export const { setBingosSearchText } = bingosSlice.actions;

export const selectBingosSearchText = ({ bingosApp }) =>
  bingosApp.bingos.searchText;

export default bingosSlice.reducer;
