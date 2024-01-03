import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";


export const getSliders = createAsyncThunk(
  "slidersApp/getSliders",
  async (sliderData) => {

    const response = await axios.get(BASE_URL + API_VERSION3 + `/back/sliders/${sliderData}`, {
      headers: { Authorization: TOKEN },
    });
    let data = await response.data;
    data = data.filter(item => item.type === sliderData);
    data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return data;
  }
);

export const getVariables = createAsyncThunk("slidersApp/getVariables", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/variables", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

const slidersAdapter = createEntityAdapter({});

export const { selectAll: selectSliders, selectById: selectSliderById } =
  slidersAdapter.getSelectors((state) => state.slidersApp.sliders);

const slidersSlice = createSlice({
  name: "slidersApp",
  initialState: slidersAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    setSlidersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getSliders.fulfilled]: slidersAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setSlidersSearchText } = slidersSlice.actions;

export const selectSlidersSearchText = ({ slidersApp }) =>
  slidersApp.sliders.searchText;

export default slidersSlice.reducer;
