import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const addBonusExecution = createAsyncThunk(
  "bonusExecutionsApp/bonusExecution/addBonusExecution",
  async (bonusExecutionData, { dispatch, getState }) => {
    console.log('bonusExecutionData a guardar', bonusExecutionData)
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/bonusExecution",
      bonusExecutionData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    console.log('dataaaaaa', data)
    return data;
  }
);

export const updateBonusExecution = createAsyncThunk(
  "bonusExecutionsApp/bonusExecution/updateBonusExecution",
  async (bonusExecutionData, { dispatch, getState }) => {
    console.log('bonusExecutionData', bonusExecutionData)
    const response = await axios.put(
      BASE_URL + API_VERSION3 + `/back/bonusExecution/${bonusExecutionData.id}`,
      { ...bonusExecutionData },
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);


export const removeBonusExecution = createAsyncThunk(
  "bonusExecutionsApp/bonusExecution/removeBonusExecution",
  async (val, { dispatch, getState }) => {
    console.log('deleteeeeeee', val)
    await axios.delete(BASE_URL + API_VERSION3 + `/back/bonusExecution/${val}`,
      { headers: { Authorization: TOKEN } });
    return id;
  }
);

const bonusExecutionSlice = createSlice({
  name: "bonusExecutionsApp/bonusExecution",
  initialState: {
    bonusExecution: { title: '' },
  },
  reducers: {
    resetBonusExecution: () => null,
    newBonusExecution: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          title: '',
        },
      }),
    },
    setBonusExecution: {
      reducer: (state, action) => action.payload,
    },
  },
  extraReducers: {
    [addBonusExecution.fulfilled]: (state, action) => action.payload,
    [updateBonusExecution.fulfilled]: (state, action) => action.payload,
    [removeBonusExecution.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetBonusExecution, newBonusExecution, setBonusExecution } = bonusExecutionSlice.actions;

export const selectBonusExecution = ({ bonusExecutionsApp }) => bonusExecutionsApp.bonusExecution;

export default bonusExecutionSlice.reducer;
