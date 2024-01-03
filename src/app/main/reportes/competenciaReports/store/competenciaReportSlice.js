import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const addCompetenciaReport = createAsyncThunk(
  "competenciaReportsApp/competenciaReport/addCompetenciaReport",
  async (competenciaReportData, { dispatch, getState }) => {
    console.log('competenciaReportData a guardar', competenciaReportData)
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/competences",
      { ...competenciaReportData },
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    console.log('dataaaaaa', data)
    return data;
  }
);

export const updateCompetenciaReport = createAsyncThunk(
  "competenciaReportsApp/competenciaReport/updateCompetenciaReport",
  async (competenciaReportData, { dispatch, getState }) => {
    console.log('competenciaReportData', competenciaReportData)
    const response = await axios.put(
      BASE_URL + API_VERSION3 + "/back/competences",
      { ...competenciaReportData },
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const addFile = createAsyncThunk(
  "competenciaReportsApp/competenciaReport/addFile",
  async (fileData, { dispatch, getState }) => {
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/files",
      { ...fileData },
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const removeCompetenciaReport = createAsyncThunk(
  "competenciaReportsApp/competenciaReport/removeCompetenciaReport",
  async (val, { dispatch, getState }) => {
    console.log('deleteeeeeee', val)
    await axios.delete(BASE_URL + API_VERSION3 + `/back/competences/${val}`,
      { headers: { Authorization: TOKEN } });
    return id;
  }
);

/*export const getReports = createAsyncThunk(
  "competenciaReportsApp/competenciaReport/getReports",
  async (val, { dispatch, getState }) => {
    console.log('deleteeeeeee', val)
    await axios.get(BASE_URL + API_VERSION3 + `/back/report/wallet/competence/${val}`,
      { headers: { Authorization: TOKEN } });
    return id;
  }
);*/


const competenciaReportSlice = createSlice({
  name: "competenciaReportsApp/competenciaReport",
  initialState: {
    competenciaReport: {
      enabled: true,
      name: '',
      type: '',
      start_date: '',
      due_date: '',
      terms: '',
      gift_1: '',
      gift_2: '',
      skus_1: '',
      skus_2: '',
      skus_3: '',
      skus_4: ''
    },
  },
  reducers: {
    resetCompetenciaReport: () => null,
    newCompetenciaReport: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          enabled: true,
          name: '',
          type: '',
          start_date: '',
          due_date: '',
          terms: '',
          gift_1: '',
          gift_2: '',
          skus_1: '',
          skus_2: '',
          skus_3: '',
          skus_4: ''
        },
      }),
    },
    setCompetenciaReport: {
      reducer: (state, action) => action.payload,
    },
  },
  extraReducers: {
    [addCompetenciaReport.fulfilled]: (state, action) => action.payload,
    [updateCompetenciaReport.fulfilled]: (state, action) => action.payload,
    [removeCompetenciaReport.fulfilled]: (state, action) => action.payload,

  },
});

export const { resetCompetenciaReport, newCompetenciaReport, setCompetenciaReport } = competenciaReportSlice.actions;

export const selectCompetenciaReport = ({ competenciaReportsApp }) => competenciaReportsApp.competenciaReport;

export default competenciaReportSlice.reducer;
