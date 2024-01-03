import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getNews = createAsyncThunk("newsApp/getNews", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/news", {
    headers: { Authorization: TOKEN },
  });
  let data = await response.data;
  data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  return data;
});

export const getVariables = createAsyncThunk("slidersApp/getVariables", async () => {
  const response = await axios.get(BASE_URL + API_VERSION3 + "/back/variables", {
    headers: { Authorization: TOKEN },
  });
  const data = await response.data;
  return data;
});

const newsAdapter = createEntityAdapter({});

export const { selectAll: selectNews, selectById: selectNewsById } =
  newsAdapter.getSelectors((state) => state.newsApp.news);

const newsSlice = createSlice({
  name: "newsApp",
  initialState: newsAdapter.getInitialState({
    searchText: "",
  }),
  reducers: {
    setNewsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getNews.fulfilled]: newsAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setNewsSearchText } = newsSlice.actions;

export const selectNewsSearchText = ({ newsApp }) =>
  newsApp.news.searchText;

export default newsSlice.reducer;
