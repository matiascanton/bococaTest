import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";


export const addNotification = createAsyncThunk(
  "notificationsApp/notification/addNotification",
  async (notificationData, { dispatch, getState }) => {
    console.log('noti', notificationData)
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/notifications",
      notificationData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const updateNotification = createAsyncThunk(
  "notificationsApp/notification/updateNotification",
  async (notificationData, { dispatch, getState }) => {
    console.log('notificationData', notificationData)
    const response = await axios.put(
      BASE_URL + API_VERSION3 + `/back/notifications/${notificationData.id}`,
      notificationData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const removeNotification = createAsyncThunk(
  "notificationsApp/notification/removeNotification",
  async (val, { dispatch, getState }) => {
    await axios.delete(BASE_URL + API_VERSION3 + `/back/notifications/${val}`, {
      headers: { Authorization: TOKEN },
    });
    return id;
  }
);


const notificationSlice = createSlice({
  name: "notificationsApp/notification",
  initialState: {
    notification: { img: "", channel: "", gec: "", title: "" },
  },
  reducers: {
    resetNotification: () => null,
    newNotification: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          img: "",
          channel: "",
          gec: "",
          title: "",
        },
      }),
    },
    setNotification: {
      reducer: (state, action) => action.payload,
    },
  },
  extraReducers: {
    [addNotification.fulfilled]: (state, action) => action.payload,
    [updateNotification.fulfilled]: (state, action) => action.payload,
    [removeNotification.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetNotification, newNotification, setNotification } = notificationSlice.actions;

export const selectNotification = ({ notificationsApp }) => notificationsApp.notification;

export default notificationSlice.reducer;
