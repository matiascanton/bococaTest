import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";


export const getNotifications = createAsyncThunk(
  "notificationsApp/getNotifications",
  async () => {
    const response = await axios.get(BASE_URL + API_VERSION3 + "/back/notifications", {
      headers: { Authorization: TOKEN },
    });
    const data = await response.data;
    data.reverse();
    return data;
  }
);

export const getVariables = createAsyncThunk("notificationsApp/getVariables", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/variables", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

const notificationsAdapter = createEntityAdapter({});

export const { selectAll: selectNotifications, selectById: selectNotificationById } =
  notificationsAdapter.getSelectors((state) => state.notificationsApp.notifications);

const notificationsSlice = createSlice({
  name: "notificationsApp",
  initialState: notificationsAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    setNotificationsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getNotifications.fulfilled]: notificationsAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setNotificationsSearchText } = notificationsSlice.actions;

export const selectNotificationsSearchText = ({ notificationsApp }) =>
  notificationsApp.notifications.searchText;

export default notificationsSlice.reducer;
