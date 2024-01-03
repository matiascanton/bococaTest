import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getCompetenciaReports = createAsyncThunk(
  "competenciaReportsApp/getCompetenciaReports",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/competences`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    data.reverse();
    return data;
  }
);
export const getVariables = createAsyncThunk(
  "competenciaReportsApp/getVariables",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + "/back/competences/variables",
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    return data;
  }
);
export const getProducts = createAsyncThunk("competenciaReportsApp/getProducts", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/products", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

export const getReports = createAsyncThunk(
  "competenciaReportsApp/getReports",
  async (val) => {
    console.log('valueeeeee', val)
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/report/wallet/competence/${val}`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    return data;
  }
);

export const getRanking = createAsyncThunk(
  "competenciaReportsApp/getRanking",
  async (val) => {
    console.log('valueeeeee', val)
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/report/competence/ranking/${val}`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    return data;
  }
);

/*export const getRankingGeneral = createAsyncThunk(
  "competenciaReportsApp/getRankingGeneral",
  async (val) => {
    console.log('valueeeeee', val)
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/competences/final_ranking/1`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    return data;
  }
);*/

export const top30 = createAsyncThunk(
  "competenciaReportsApp/top30",
  async (val) => {
    console.log('valueeeeee', val)
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/competences/final_ranking/1`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    //data.sort((a, b) => b.total - a.total);

    // Obtener los primeros 20 registros (los 20 con el "total" más alto)
    const top30 = data.slice(0, 30);

    return data;

  }
);

export const getClientDetail = createAsyncThunk(
  "competenciaReportsApp/getClientDetail",
  async (val) => {
    console.log('valueeeeee', val)
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/report/competence/details/${val.competenceId}/${val.clientId}`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    return data;
  }
);



const competenciaReportsAdapter = createEntityAdapter({});

export const { selectAll: selectCompetenciaReports, selectById: selectCompetenciaReportById } =
  competenciaReportsAdapter.getSelectors((state) => state.competenciaReportsApp.competenciaReports);

const competenciaReportsSlice = createSlice({
  name: "competenciaReportsApp",
  initialState: competenciaReportsAdapter.getInitialState({
    searchText: "",
    variables: [],
  }),
  reducers: {
    setCompetenciaReportsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getCompetenciaReports.fulfilled]: competenciaReportsAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setCompetenciaReportsSearchText } = competenciaReportsSlice.actions;

export const selectCompetenciaReportsSearchText = ({ competenciaReportsApp }) =>
  competenciaReportsApp.competenciaReports.searchText;
export const selectVariables = ({ competenciaReportsApp }) => competenciaReportsApp.competenciaReports.variables;

export default competenciaReportsSlice.reducer;
