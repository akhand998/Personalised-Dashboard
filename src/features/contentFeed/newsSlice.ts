import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNews } from '../../utils/newsApi';

export const getNews = createAsyncThunk(
  'news/getNews',
  async (category: string = 'general') => {
    return await fetchNews(category);
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    articles: [],
    status: 'idle',
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNews.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles = action.payload;
      })
      .addCase(getNews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch news';
      });
  },
});

export default newsSlice.reducer; 