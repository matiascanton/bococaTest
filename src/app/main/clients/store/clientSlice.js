import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getClient = createAsyncThunk(
  "clientsApp/client/getClient",
  async (clientId) => {
    const response = await axios.get(
      BASE_URL + API_VERSION + `/back/clients/${clientId}`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    return data === undefined ? null : data;
  }
);
export const getCanjes = createAsyncThunk(
  "clientsApp/client/getCanjes",
  async (clientId) => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/canjes/pedido`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    console.log('data', data)
    data.reverse()
    const filteredData = data.filter(obj => obj.client_id === clientId);
    console.log('filteredData', filteredData)
    return filteredData;
  }
);

export const getClientData = createAsyncThunk(
  "clientsApp/client/getClientData",
  async (clientId) => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/clients/${clientId}`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    console.log('data', data)

    return data;
  }
);

export const getActiveClients = createAsyncThunk(
  "clientsApp/client/getActiveClients",
  async (clientPage) => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/active_clients/pagination/${clientPage}`,
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    //console.log('data', data)

    return data;
  }
);



const clientSlice = createSlice({
  name: "clientsApp/client",
  initialState: null,
  reducers: {
    resetClient: () => null,
  },
  extraReducers: {
    [getClient.fulfilled]: (state, action) => action.payload,
    [getCanjes.fulfilled]: (state, action) => action.payload,
    [getClientData.fulfilled]: (state, action) => action.payload,
    [getActiveClients.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetClient } = clientSlice.actions;

export const selectClient = ({ clientsApp }) => clientsApp.client;

export default clientSlice.reducer;
