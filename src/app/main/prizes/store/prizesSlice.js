import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getPrizes = createAsyncThunk(
  "prizesApp/getPrizes",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/catalogs`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    data.reverse()
    return data;
  }
);

export const getVariables = createAsyncThunk(
  "prizesApp/getVariables",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + "/back/variables",
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    return data;
  }
);
export const getBrands = createAsyncThunk("misionsApp/getBrands", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/brands", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

export const getProducts = createAsyncThunk("misionsApp/getProducts", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/products", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

const prizesAdapter = createEntityAdapter({});

export const { selectAll: selectPrizes, selectById: selectPrizeById } =
  prizesAdapter.getSelectors((state) => state.prizesApp.prizes);

const prizesSlice = createSlice({
  name: "prizesApp",
  initialState: prizesAdapter.getInitialState({
    searchText: "",
    variables: [],
  }),
  reducers: {
    setPrizesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getPrizes.fulfilled]: prizesAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setPrizesSearchText } = prizesSlice.actions;

export const selectPrizesSearchText = ({ prizesApp }) =>
  prizesApp.prizes.searchText;
export const selectVariables = ({ prizesApp }) => prizesApp.prizes.variables;

export default prizesSlice.reducer;
