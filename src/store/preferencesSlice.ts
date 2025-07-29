import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for favorite items
interface FavoriteItem {
  id?: string | number;
  type?: 'movie' | 'news';
  title: string;
  description: string;
  url: string;
  source?: {
    name: string;
  };
}

interface PreferencesState {
  categories: string[];
  darkMode: boolean;
  favorites: FavoriteItem[];
}

const initialState: PreferencesState = {
  categories: [],
  darkMode: false,
  favorites: [],
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<string[]>) {
      state.categories = action.payload;
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
    },
    addFavorite(state, action: PayloadAction<FavoriteItem>) {
      if (!state.favorites) state.favorites = [];
      if (
        (action.payload.type === 'movie' && !state.favorites.some(fav => fav.type === 'movie' && fav.id === action.payload.id)) ||
        (action.payload.type !== 'movie' && !state.favorites.some(fav => fav.type !== 'movie' && fav.url === action.payload.url))
      ) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.favorites = state.favorites.filter(fav =>
        (fav.type === 'movie' && `movie-${fav.id}` !== action.payload) ||
        (fav.type !== 'movie' && `news-${fav.url}` !== action.payload)
      );
    },
    setFavorites(state, action: PayloadAction<FavoriteItem[]>) {
      state.favorites = action.payload;
    },
  },
});

export const { setCategories, toggleDarkMode, setDarkMode, addFavorite, removeFavorite, setFavorites } = preferencesSlice.actions;
export default preferencesSlice.reducer; 