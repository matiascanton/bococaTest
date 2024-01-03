import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";


export const addSlider = createAsyncThunk(
  "slidersApp/slider/addSlider",
  async (sliderData, { dispatch, getState }) => {
    console.log('slideeeeer', sliderData)
    const response = await axios.post(
      BASE_URL + API_VERSION + "/back/sliders",
      sliderData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const updateSlider = createAsyncThunk(
  "slidersApp/slider/updateSlider",
  async (sliderData, { dispatch, getState }) => {
    const response = await axios.put(
      BASE_URL + API_VERSION + "/back/sliders",
      sliderData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const removeSlider = createAsyncThunk(
  "slidersApp/slider/removeSlider",
  async (val, { dispatch, getState }) => {
    const { id } = getState().slidersApp.slider;
    const data = { id: id };
    await axios.delete(BASE_URL + API_VERSION + "/back/sliders", {
      headers: { Authorization: TOKEN },
      data,
    });
    return id;
  }
);


const sliderSlice = createSlice({
  name: "slidersApp/slider",
  initialState: {
    slider: { image: "", enabled: false, channel: "", gec: "", type: "" },
  },
  reducers: {
    resetSlider: () => null,
    newSlider: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          image: "",
          enabled: false,
          channel: "",
          gec: "",
          type: "",
        },
      }),
    },
    setSlider: {
      reducer: (state, action) => action.payload,
    },
  },
  extraReducers: {
    [addSlider.fulfilled]: (state, action) => action.payload,
    [updateSlider.fulfilled]: (state, action) => action.payload,
    [removeSlider.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetSlider, newSlider, setSlider } = sliderSlice.actions;

export const selectSlider = ({ slidersApp }) => slidersApp.slider;

export default sliderSlice.reducer;
