import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getUsers = createAsyncThunk("usersApp/getUsers", async () => {
  const response = await axios.get(BASE_URL + API_VERSION + "/back/users", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

const usersAdapter = createEntityAdapter({});

export const { selectAll: selectUsers, selectById: selectUserById } =
  usersAdapter.getSelectors((state) => state.usersApp.users);

const usersSlice = createSlice({
  name: "usersApp",
  initialState: usersAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    setUsersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getUsers.fulfilled]: usersAdapter.setAll,
  },
});

export const { setUsersSearchText } = usersSlice.actions;

export const selectUsersSearchText = ({ usersApp }) =>
  usersApp.users.searchText;

export default usersSlice.reducer;
