import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getClients = createAsyncThunk(
  "clientsApp/getClients",
  async (page) => {
    const response = await axios.get(
      BASE_URL + API_VERSION + `/back/clients/pagination/${page}`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    return data;
  }
);

export const getVariables = createAsyncThunk(
  "clientsApp/getVariables",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION + "/back/clients/variables",
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    return data;
  }
);

const clientsAdapter = createEntityAdapter({});

export const { selectAll: selectClients, selectById: selectClientById } =
  clientsAdapter.getSelectors((state) => state.clientsApp.clients);

const clientsSlice = createSlice({
  name: "clientsApp",
  initialState: clientsAdapter.getInitialState({
    searchText: "",
    variables: [],
  }),
  reducers: {
    setClientsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getClients.fulfilled]: clientsAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setClientsSearchText } = clientsSlice.actions;

export const selectClientsSearchText = ({ clientsApp }) =>
  clientsApp.clients.searchText;
export const selectVariables = ({ clientsApp }) => clientsApp.clients.variables;

export default clientsSlice.reducer;
