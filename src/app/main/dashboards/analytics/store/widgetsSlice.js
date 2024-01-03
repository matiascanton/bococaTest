import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import data from "./data";

import { API_VERSION3,BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getWidgets = createAsyncThunk("analyticsDashboardApp/widgets/getWidgets", async () => {
  //const response = await axios.get('/api/dashboards/analytics/widgets');

  //  const data = await response.data;

  return data;
});
export const getMonthData= createAsyncThunk("analyticsDashboardApp/widgets/getMonthData", async (MonthData) => {
//puede ser solo el año o todos los datos
  const response = await axios.post(BASE_URL + API_VERSION3 + "/back/dashboard",{year:MonthData.year, month:MonthData.month, channel:MonthData.channel, group:MonthData.group}, {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

export const getVariables = createAsyncThunk("analyticsDashboardApp/widgets/getVariables", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/variables", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

export const getBrands = createAsyncThunk("analyticsDashboardApp/widgets/getBrands", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/brands", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

export const getProducts = createAsyncThunk("analyticsDashboardApp/widgets/getProducts", async (brandId) => {
  const response = await axios.get(BASE_URL + API_VERSION3 + `/back/products/by_brand/${brandId}`, {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

const widgetsSlice = createSlice({
  name: "analyticsDashboardApp/widgets",
  initialState: {
    exportedData: [],
    exportedSummaryInfo: [],
  },
  reducers: {setExportedData: (state, action) => {
    state.exportedData = action.payload;
  },
  setExportedSummaryInfo: (state, action) => {
    state.exportedSummaryInfo = action.payload;
  },
},
  extraReducers: {
    [getWidgets.fulfilled]: (state, action) => {
      state.widgets= action.payload
    },
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
    [getBrands.fulfilled]: (state, action) => {
      state.brands= action.payload;
    },
    [getProducts.fulfilled]: (state, action) => {
      state.products = action.payload;
    },
    [getMonthData.fulfilled]: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const selectWidgets = ({ analyticsDashboardApp }) => analyticsDashboardApp.widgets;
export const selectExportedData = (state) => state.exportedData;
export const { setExportedData } = widgetsSlice.actions; // Asegúrate de exportar setExportedData junto con las demás acciones
export const selectSummaryInfo = (state) => state.exportedSummaryInfo;
export const { setExportedSummaryInfo } = widgetsSlice.actions;
export default widgetsSlice.reducer;
