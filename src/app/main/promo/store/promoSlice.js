import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getPromo = createAsyncThunk("promoApp/getPromo", async () => {
  const response = await axios.get(
    BASE_URL + API_VERSION + "/clients/promos/ctacte",
    {
      headers: { Authorization: TOKEN },
    }
  );
  const data = await response.data;
  return data;
});

const promoAdapter = createEntityAdapter({});

export const { selectAll: selectPromo, selectById: selectPromoById } =
  promoAdapter.getSelectors((state) => state.promoApp.promo);

export const getSummary = createAsyncThunk(
  "promoApp/getSummary",
  async (nn, { getState }) => {
    const response = await axios.get(
      BASE_URL + API_VERSION + "/clients/promos/summary",
      {
        headers: { Authorization: TOKEN },
      }
    );
    const { promoApp } = getState();
    const summary = await response.data;
    const newPromo = {
      ...promoApp.promo,
      summary,
    };
    return newPromo;
  }
);

const promoSlice = createSlice({
  name: "promoApp",
  initialState: promoAdapter.getInitialState({}),
  reducers: {},
  extraReducers: {
    [getPromo.fulfilled]: promoAdapter.setAll,
    [getSummary.fulfilled]: (state, action) => action.payload,
  },
});
export const selectSummary = ({ promoApp }) => promoApp.promo.summary;

export default promoSlice.reducer;
