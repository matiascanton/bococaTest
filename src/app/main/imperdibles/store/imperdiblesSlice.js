import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getImperdibles = createAsyncThunk(
  "imperdiblesApp/getImperdibles",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/imperdibles`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    let data = await response.data;
    data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return data;
  }
);

export const getBrands = createAsyncThunk("imperdiblesApp/getBrands", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/brands", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

export const getProducts = createAsyncThunk("imperdiblesApp/getProducts", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/products", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

export const getVariables = createAsyncThunk("imperdiblesApp/getVariables", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/variables", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});


const imperdiblesAdapter = createEntityAdapter({});

export const { selectAll: selectImperdibles, selectById: selectImperdibleById } =
  imperdiblesAdapter.getSelectors((state) => state.imperdiblesApp.imperdibles);

const imperdiblesSlice = createSlice({
  name: "imperdiblesApp",
  initialState: imperdiblesAdapter.getInitialState({
    searchText: "",
    variables: [],
  }),
  reducers: {
    setImperdiblesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getImperdibles.fulfilled]: imperdiblesAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setImperdiblesSearchText } = imperdiblesSlice.actions;

export const selectImperdiblesSearchText = ({ imperdiblesApp }) =>
  imperdiblesApp.imperdibles.searchText;
export const selectVariables = ({ imperdiblesApp }) => imperdiblesApp.imperdibles.variables;

export default imperdiblesSlice.reducer;
