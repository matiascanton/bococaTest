import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const addBonus = createAsyncThunk(
  "bonusesApp/bonus/addBonus",
  async (bonusData, { dispatch, getState }) => {
    console.log('bonusData a guardar', bonusData)
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/bonus",
      bonusData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    console.log('dataaaaaa', data)
    return data;
  }
);

export const updateBonus = createAsyncThunk(
  "bonusesApp/bonus/updateBonus",
  async (bonusData, { dispatch, getState }) => {
    console.log('bonusData', bonusData)
    const response = await axios.put(
      BASE_URL + API_VERSION3 + `/back/bonus/${bonusData.id}`,
      { ...bonusData },
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);


export const removeBonus = createAsyncThunk(
  "bonusesApp/bonus/removeBonus",
  async (val, { dispatch, getState }) => {
    console.log('deleteeeeeee', val)
    await axios.delete(BASE_URL + API_VERSION3 + `/back/bonus/${val}`,
      { headers: { Authorization: TOKEN } });
    return id;
  }
);

const bonusSlice = createSlice({
  name: "bonusesApp/bonus",
  initialState: {
    bonus: { title: '' },
  },
  reducers: {
    resetBonus: () => null,
    newBonus: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          title: '',
        },
      }),
    },
    setBonus: {
      reducer: (state, action) => action.payload,
    },
  },
  extraReducers: {
    [addBonus.fulfilled]: (state, action) => action.payload,
    [updateBonus.fulfilled]: (state, action) => action.payload,
    [removeBonus.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetBonus, newBonus, setBonus } = bonusSlice.actions;

export const selectBonus = ({ bonusesApp }) => bonusesApp.bonus;

export default bonusSlice.reducer;
