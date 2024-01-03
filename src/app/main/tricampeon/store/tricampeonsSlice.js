import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getTricampeons = createAsyncThunk(
  "tricampeonsApp/getTricampeons",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/competences`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    data.reverse();
    return data;
  }
);
export const getVariables = createAsyncThunk(
  "tricampeonsApp/getVariables",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + "/back/competences/variables",
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    return data;
  }
);
export const getProducts = createAsyncThunk("tricampeonsApp/getProducts", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/products", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

const tricampeonsAdapter = createEntityAdapter({});

export const { selectAll: selectTricampeons, selectById: selectTricampeonById } =
  tricampeonsAdapter.getSelectors((state) => state.tricampeonsApp.tricampeons);

const tricampeonsSlice = createSlice({
  name: "tricampeonsApp",
  initialState: tricampeonsAdapter.getInitialState({
    searchText: "",
    variables: [],
  }),
  reducers: {
    setTricampeonsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getTricampeons.fulfilled]: tricampeonsAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setTricampeonsSearchText } = tricampeonsSlice.actions;

export const selectTricampeonsSearchText = ({ tricampeonsApp }) =>
  tricampeonsApp.tricampeons.searchText;
export const selectVariables = ({ tricampeonsApp }) => tricampeonsApp.tricampeons.variables;

export default tricampeonsSlice.reducer;
