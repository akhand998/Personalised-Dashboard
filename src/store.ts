import { configureStore } from '@reduxjs/toolkit';
import preferencesReducer from './store/preferencesSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import newsReducer from './features/contentFeed/newsSlice';
import moviesReducer from './features/contentFeed/moviesSlice';

const rootReducer = combineReducers({
  preferences: preferencesReducer,
  news: newsReducer,
  movies: moviesReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['preferences'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 