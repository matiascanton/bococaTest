import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";


export const addCheckPhoto = createAsyncThunk(
  "checkPhotosApp/checkPhoto/addCheckPhoto",
  async (checkPhotoData, { dispatch, getState }) => {
    console.log('noti', checkPhotoData)
    const response = await axios.post(
      BASE_URL + API_VERSION3 + "/back/checkPhotos",
      checkPhotoData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const updateCheckPhoto = createAsyncThunk(
  "checkPhotosApp/checkPhoto/updateCheckPhoto",
  async (checkPhotoData, { dispatch, getState }) => {
    console.log('checkPhotoData', checkPhotoData)
    const response = await axios.put(
      BASE_URL + API_VERSION3 + `/back/checkPhotos/${checkPhotoData.id}`,
      checkPhotoData,
      { headers: { Authorization: TOKEN } }
    );
    const data = await response.data;
    return data;
  }
);

export const removeCheckPhoto = createAsyncThunk(
  "checkPhotosApp/checkPhoto/removeCheckPhoto",
  async (val, { dispatch, getState }) => {
    await axios.delete(BASE_URL + API_VERSION3 + `/back/checkPhotos/${val}`, {
      headers: { Authorization: TOKEN },
    });
    return id;
  }
);


const checkPhotoSlice = createSlice({
  name: "checkPhotosApp/checkPhoto",
  initialState: {
    checkPhoto: { img: "", channel: "", gec: "", title: "" },
  },
  reducers: {
    resetCheckPhoto: () => null,
    newCheckPhoto: {
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
    setCheckPhoto: {
      reducer: (state, action) => action.payload,
    },
  },
  extraReducers: {
    [addCheckPhoto.fulfilled]: (state, action) => action.payload,
    [updateCheckPhoto.fulfilled]: (state, action) => action.payload,
    [removeCheckPhoto.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetCheckPhoto, newCheckPhoto, setCheckPhoto } = checkPhotoSlice.actions;

export const selectCheckPhoto = ({ checkPhotosApp }) => checkPhotosApp.checkPhoto;

export default checkPhotoSlice.reducer;
