import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getMisions = createAsyncThunk(
  "misionsApp/getMisions",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/monthly_missions`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    let data = await response.data;
    data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
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

export const getVariables = createAsyncThunk("misionsApp/getVariables", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/variables", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});


const misionsAdapter = createEntityAdapter({});

export const { selectAll: selectMisions, selectById: selectMisionById } =
  misionsAdapter.getSelectors((state) => state.misionsApp.misions);

const misionsSlice = createSlice({
  name: "misionsApp",
  initialState: misionsAdapter.getInitialState({
    searchText: "",
    variables: [],
  }),
  reducers: {
    setMisionsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getMisions.fulfilled]: misionsAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setMisionsSearchText } = misionsSlice.actions;

export const selectMisionsSearchText = ({ misionsApp }) =>
  misionsApp.misions.searchText;
export const selectVariables = ({ misionsApp }) => misionsApp.misions.variables;

export default misionsSlice.reducer;
