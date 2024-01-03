import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getStocks = createAsyncThunk(
  "stocksApp/getStocks",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/catalogs/stock`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    console.log('data', data)
    return data;
  }
);

export const getBrands = createAsyncThunk("stocksApp/getBrands", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/brands", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

export const getProducts = createAsyncThunk("stocksApp/getProducts", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/products", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

export const getVariables = createAsyncThunk("stocksApp/getVariables", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/variables", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});


const stocksAdapter = createEntityAdapter({
  selectId: (stock) => stock.sku,
});

export const { selectAll: selectStocks, selectById: selectStockBySku } =
  stocksAdapter.getSelectors((state) => state.stocksApp.stocks);

const stocksSlice = createSlice({
  name: "stocksApp",
  initialState: stocksAdapter.getInitialState({
    searchText: "",
    variables: [],
  }),
  reducers: {
    setStocksSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getStocks.fulfilled]: stocksAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setStocksSearchText } = stocksSlice.actions;

export const selectStocksSearchText = ({ stocksApp }) =>
  stocksApp.stocks.searchText;
export const selectVariables = ({ stocksApp }) => stocksApp.stocks.variables;

export default stocksSlice.reducer;
