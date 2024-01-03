import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getCanjes = createAsyncThunk(
  "canjesApp/getCanjes",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/canjes/pedido`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    data.reverse()
    return data;
  }
);

export const getCanjesEntregado = createAsyncThunk(
  "canjesApp/getCanjesEntregado",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/canjes/entregado`,
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
  "canjesApp/getVariables",
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

const canjesAdapter = createEntityAdapter({});

export const { selectAll: selectCanjes, selectById: selectCanjeById } =
  canjesAdapter.getSelectors((state) => state.canjesApp.canjes);

const canjesSlice = createSlice({
  name: "canjesApp",
  initialState: canjesAdapter.getInitialState({
    searchText: "",
    variables: [],
  }),
  reducers: {
    setCanjesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getCanjes.fulfilled]: canjesAdapter.setAll,
    [getCanjesEntregado.fulfilled]: canjesAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setCanjesSearchText } = canjesSlice.actions;

export const selectCanjesSearchText = ({ canjesApp }) =>
  canjesApp.canjes.searchText;
export const selectVariables = ({ canjesApp }) => canjesApp.canjes.variables;

export default canjesSlice.reducer;
