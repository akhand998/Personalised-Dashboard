import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPopularMovies } from '../../utils/tmdbApi';

export const getMovies = createAsyncThunk(
  'movies/getMovies',
  async () => {
    return await fetchPopularMovies();
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    status: 'idle',
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMovies.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.movies = action.payload;
      })
      .addCase(getMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch movies';
      });
  },
});

export default moviesSlice.reducer; 