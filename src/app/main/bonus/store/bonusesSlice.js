import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getBonuses = createAsyncThunk(
  "bonusesApp/getBonuses",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/bonus`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    return data;
  }
);

export const getBrands = createAsyncThunk("bonusesApp/getBrands", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/brands", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

export const getProducts = createAsyncThunk("bonusesApp/getProducts", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/products", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

export const getVariables = createAsyncThunk("bonusesApp/getVariables", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/variables", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});


const bonusesAdapter = createEntityAdapter({});

export const { selectAll: selectBonuses, selectById: selectBonusById } =
  bonusesAdapter.getSelectors((state) => state.bonusesApp.bonuses);

const bonusesSlice = createSlice({
  name: "bonusesApp",
  initialState: bonusesAdapter.getInitialState({
    searchText: "",
    variables: [],
  }),
  reducers: {
    setBonusesSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getBonuses.fulfilled]: bonusesAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setBonusesSearchText } = bonusesSlice.actions;

export const selectBonusesSearchText = ({ bonusesApp }) =>
  bonusesApp.bonuses.searchText;
export const selectVariables = ({ bonusesApp }) => bonusesApp.bonuses.variables;

export default bonusesSlice.reducer;
