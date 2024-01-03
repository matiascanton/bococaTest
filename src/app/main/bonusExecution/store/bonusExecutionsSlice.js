import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getBonusExecutions = createAsyncThunk(
  "bonusExecutionsApp/getBonusExecutions",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/bonusExecution`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    return data;
  }
);

export const getBrands = createAsyncThunk("bonusExecutionsApp/getBrands", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/brands", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

export const getProducts = createAsyncThunk("bonusExecutionsApp/getProducts", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/products", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

export const getVariables = createAsyncThunk("bonusExecutionsApp/getVariables", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/variables", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});


const bonusExecutionsAdapter = createEntityAdapter({});

export const { selectAll: selectBonusExecutions, selectById: selectBonusExecutionById } =
  bonusExecutionsAdapter.getSelectors((state) => state.bonusExecutionsApp.bonusExecutions);

const bonusExecutionsSlice = createSlice({
  name: "bonusExecutionsApp",
  initialState: bonusExecutionsAdapter.getInitialState({
    searchText: "",
    variables: [],
  }),
  reducers: {
    setBonusExecutionsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getBonusExecutions.fulfilled]: bonusExecutionsAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setBonusExecutionsSearchText } = bonusExecutionsSlice.actions;

export const selectBonusExecutionsSearchText = ({ bonusExecutionsApp }) =>
  bonusExecutionsApp.bonusExecutions.searchText;
export const selectVariables = ({ bonusExecutionsApp }) => bonusExecutionsApp.bonusExecutions.variables;

export default bonusExecutionsSlice.reducer;
