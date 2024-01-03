import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getMarketers = createAsyncThunk(
  "marketersApp/getMarketers",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/comercializadores/all`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    return data;
  }
);


const marketersAdapter = createEntityAdapter({
  selectId: (marketer) => marketer.legajo, 
});

export const { selectAll: selectMarketers, selectById: selectMarketertById  } =
  marketersAdapter.getSelectors((state) => state.marketersApp.marketers);

const marketersSlice = createSlice({
  name: "marketersApp",
  initialState: marketersAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    setMarketersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getMarketers.fulfilled]: marketersAdapter.setAll,
   
  },
});

export const { setMarketersSearchText } = marketersSlice.actions;

export const selectMarketersSearchText = ({ marketersApp }) =>
  marketersApp.marketers.searchText;

export default marketersSlice.reducer;
