import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const addStock = createAsyncThunk(
  "stocksApp/stock/addStock",
  async (stockData, { dispatch, getState }) => {
    console.log('stockData a guardar', stockData)
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/stock",
      stockData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    console.log('dataaaaaa', data)
    return data;
  }
);

export const updateStock = createAsyncThunk(
  "stocksApp/stock/updateStock",
  async (stockData, { dispatch, getState }) => {
    console.log('stockData', stockData)
    const response = await axios.put(
      BASE_URL + API_VERSION3 + '/back/catalogs/stock',
      { "products": stockData },
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);


export const removeStock = createAsyncThunk(
  "stocksApp/stock/removeStock",
  async (val, { dispatch, getState }) => {
    console.log('deleteeeeeee', val)
    await axios.delete(BASE_URL + API_VERSION3 + `/back/stock/${val}`,
      { headers: { Authorization: TOKEN } });
    return id;
  }
);

const stockSlice = createSlice({
  name: "stocksApp/stock",
  initialState: {
    stock: { title: '' },
  },
  reducers: {
    resetStock: () => null,
    newStock: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          title: '',
        },
      }),
    },
    setStock: {
      reducer: (state, action) => action.payload,
    },
  },
  extraReducers: {
    [addStock.fulfilled]: (state, action) => action.payload,
    [updateStock.fulfilled]: (state, action) => action.payload,
    [removeStock.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetStock, newStock, setStock } = stockSlice.actions;

export const selectStock = ({ stocksApp }) => stocksApp.stock;

export default stockSlice.reducer;
