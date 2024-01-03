import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_VERSION, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const addBingo = createAsyncThunk(
  "bingosApp/bingo/addBingo",
  async (bingoData, { dispatch, getState }) => {
    const response = await axios.post(
      BASE_URL + API_VERSION + "/back/bingos",
      bingoData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const updateBingo = async (bingoData) => {
  console.log(BASE_URL + API_VERSION + "/back/bingos");
  const response = await axios.put(
    BASE_URL + API_VERSION + "/back/bingos",
    { ...bingoData },
    { headers: { Authorization: TOKEN } }
  );
  console.log(response);
  const data = await response.data;
  console.log(data);
  return data;
};

export const addFile = createAsyncThunk(
  "bingosApp/bingo/addFile",
  async (fileData, { dispatch, getState }) => {
    const response = await axios.post(
      BASE_URL + API_VERSION + "/back/files/bingo",
      fileData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;

    return data;
  }
);

export const removeBingo = createAsyncThunk(
  "bingosApp/bingo/removeBingo",
  async (val, { dispatch, getState }) => {
    await axios.delete(BASE_URL + API_VERSION + `/back/bingos/${val}`);
    return id;
  }
);

const bingoSlice = createSlice({
  name: "bingosApp/bingo",
  initialState: {
    bingo: {
      name: "",
      type: "",
      year_month: "",
      header: "",
      mission_1: null,
      mission_2: null,
      mission_3: null,
      mission_4: null,
      mission_5: null,
      mission_6: null,
      mission_7: null,
      mission_8: null,
      mission_9: null,
      mission_10: null,
      line_1: "",
      line_2: "",
      header_line_1: "",
      header_line_2: "",
      expire_at: "",
    },
  },
  reducers: {
    resetBingo: () => null,
    newBingo: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          id: "",
          name: "",
          type: "",
          year_month: "",
          header: "",
          mission_1: null,
          mission_2: null,
          mission_3: null,
          mission_4: null,
          mission_5: null,
          mission_6: null,
          mission_7: null,
          mission_8: null,
          mission_9: null,
          mission_10: null,
          line_1: "",
          line_2: "",
          header_line_1: "",
          header_line_2: "",
          expire_at: "",
        },
      }),
    },
    setBingo: {
      reducer: (state, action) => action.payload,
    },
  },
  extraReducers: {
    [addBingo.fulfilled]: (state, action) => action.payload,
    [updateBingo.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetBingo, newBingo, setBingo } = bingoSlice.actions;

export const selectBingo = ({ bingosApp }) => bingosApp.bingo;

export default bingoSlice.reducer;
