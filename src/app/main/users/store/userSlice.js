import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION3, API_VERSION, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getUser = createAsyncThunk(
  "usersApp/user/getUser",
  async (userId) => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/users/${userId}`,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data[0];
    data.photo_url === null || data.photo_url === ""?data.photo_url="assets/images/user3.png":data.photo_url
    
    return data === undefined ? null : data;
  }
);

export const removeUser = createAsyncThunk(
  "usersApp/user/removeUser",
  async (val, { dispatch, getState }) => {
    const { id } = getState().usersApp.user;
    const data = { id: id };
    await axios.delete(BASE_URL + API_VERSION + "/back/users", {
      headers: { Authorization: TOKEN },
      data,
    });
    return id;
  }
);

export const addUser = createAsyncThunk(
  "usersApp/user/addUser",
  async (userData, { dispatch, getState }) => {
    userData.id =
      userData.first_name.toLowerCase() +
      "." +
      userData.last_name.toLowerCase();
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/users",
      userData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;

    return data;
  }
);

export const updateUser = createAsyncThunk(
  "usersApp/user/updateUser",
  async (userData, { dispatch, getState }) => {
    const response = await axios.put(
      BASE_URL + API_VERSION3 + "/back/users",
      userData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

const userSlice = createSlice({
  name: "usersApp/user",
  initialState: null,
  reducers: {
    resetUser: () => null,
    newUser: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          email: "",
          enabled: false,
          first_name: "",
          last_name: "",
          photo_url:"",
          // eslint-disable-next-line camelcase, no-undef
          id: "",
          password: "",
        },
      }),
    },
  },
  extraReducers: {
    [getUser.fulfilled]: (state, action) => action.payload,
    [updateUser.fulfilled]: (state, action) => action.payload,
    [addUser.fulfilled]: (state, action) => action.payload,
    [removeUser.fulfilled]: (state, action) => null,
  },
});

export const { newUser, resetUser } = userSlice.actions;

export const selectUser = ({ usersApp }) => usersApp.user;

export default userSlice.reducer;
