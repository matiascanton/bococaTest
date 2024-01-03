import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getPromotions = createAsyncThunk(
  "promotionsApp/getPromotions",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + "/back/promotions/coupons",
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    data.reverse()
    return data;
  }
);

export const getVariables = createAsyncThunk("promotionsApp/getVariables", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/variables", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

const promotionsAdapter = createEntityAdapter({});

export const { selectAll: selectPromotions, selectById: selectPromotionById } =
  promotionsAdapter.getSelectors((state) => state.promotionsApp.promotions);

const promotionsSlice = createSlice({
  name: "promotionsApp",
  initialState: promotionsAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    setPromotionsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getPromotions.fulfilled]: promotionsAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setPromotionsSearchText } = promotionsSlice.actions;
export const selectPromotionsSearchText = ({ promotionsApp }) =>
  promotionsApp.promotions.searchText;

export default promotionsSlice.reducer;
