import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_VERSION, API_VERSION3, BASE_URL, TOKEN } from "app/configs/settingsConfig";


export const addNews = createAsyncThunk(
    "newsApp/news/addNews",
    async (newsData, { dispatch, getState }) => {
        console.log('news', newsData)
        const response = await axios.post(
            BASE_URL + API_VERSION3 + "/back/news",
            newsData,
            { headers: { Authorization: TOKEN } }
        );
        const data = await response.data;
        return data;
    }
);

export const updateNews = createAsyncThunk(
    "newsApp/news/updateNews",
    async (newsData, { dispatch, getState }) => {
        console.log('newsdata', newsData)
        const response = await axios.put(
            BASE_URL + API_VERSION3 + `/back/news/${newsData.id}`,
            { ...newsData },
            { headers: { Authorization: TOKEN } }
        );
        const data = await response.data;
        console.log('dataerror', data)
        return data;
    }
);

export const removeNews = createAsyncThunk(
    "newsApp/news/removeNews",
    async (val, { dispatch, getState }) => {
        console.log('val', val)
        await axios.delete(BASE_URL + API_VERSION3 + `/back/news/${val}`, {
            headers: { Authorization: TOKEN },
        });
        return id;
    }
);


const newSlice = createSlice({
    name: "newsApp/news",
    initialState: {
        news: { channel: "", gec: "" },
    },
    reducers: {
        resetNews: () => null,
        newNews: {
            reducer: (state, action) => action.payload,
            prepare: (event) => ({
                payload: {
                    channel: "",
                    gec: "",
                },
            }),
        },
        setNews: {
            reducer: (state, action) => action.payload,
        },
    },
    extraReducers: {
        [addNews.fulfilled]: (state, action) => action.payload,
        [updateNews.fulfilled]: (state, action) => action.payload,
        [removeNews.fulfilled]: (state, action) => action.payload,
    },
});

export const { resetNews, newNews, setNews } = newSlice.actions;

export const selectNews = ({ newsApp }) => newsApp.newsi;

export default newSlice.reducer;
