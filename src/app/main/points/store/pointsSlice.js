import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";

export const getPoints = createAsyncThunk(
  "pointsApp/getPoints",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + `/back/manual_points`,
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
  "pointsApp/getVariables",
  async () => {
    const response = await axios.get(
      BASE_URL + API_VERSION3 + "/back/variables",
      {
        headers: { Authorization: TOKEN },
      }
    );
    const data = await response.data;
    return data;
  }
);

const pointsAdapter = createEntityAdapter({});

export const { selectAll: selectPoints, selectById: selectPointById } =
  pointsAdapter.getSelectors((state) => state.pointsApp.points);

const pointsSlice = createSlice({
  name: "pointsApp",
  initialState: pointsAdapter.getInitialState({
    searchText: "",
    variables: [],
  }),
  reducers: {
    setPointsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || "" }),
    },
  },
  extraReducers: {
    [getPoints.fulfilled]: pointsAdapter.setAll,
    [getVariables.fulfilled]: (state, action) => {
      state.variables = action.payload;
    },
  },
});

export const { setPointsSearchText } = pointsSlice.actions;

export const selectPointsSearchText = ({ pointsApp }) =>
  pointsApp.points.searchText;
export const selectVariables = ({ pointsApp }) => pointsApp.points.variables;

export default pointsSlice.reducer;
