import axios from "axios";
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { API_VERSION, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getBrands = createAsyncThunk("brandsApp/getBrands", async () => {
  const response = await axios.get(BASE_URL + API_VERSION + "/back/brands", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

const brandsAdapter = createEntityAdapter({});

export const { selectAll: selectBrands, selectById: selectBrandById } =
  brandsAdapter.getSelectors((state) => state.brandsApp.brands);

const brandsSlice = createSlice({
  name: "brandsApp",
  initialState: brandsAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    setBrandsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getBrands.fulfilled]: brandsAdapter.setAll,
  },
});

export const { setBrandsSearchText } = brandsSlice.actions;

export const selectBrandsSearchText = ({ brandsApp }) =>
  brandsApp.brands.searchText;

export default brandsSlice.reducer;
