'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { getMovies } from './moviesSlice';
import { RootState } from '../../store';
import { addFavorite, removeFavorite } from '../../store/preferencesSlice';

// Define types for movie data
interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  type?: 'movie';
}

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

// Helper to get a unique id for each favorite
const getFavoriteId = (item: Movie): string =>
  item.type === 'movie' ? `movie-${item.id}` : `news-${item.id}`;

const MoviesFeed: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { movies, status, error } = useSelector((state: RootState) => state.movies);
  console.log('MoviesFeed: Redux state - movies:', movies, 'status:', status, 'error:', error);
  const { favorites = [] } = useSelector((state: RootState) => state.preferences);
  const [showAll, setShowAll] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    console.log('MoviesFeed: Dispatching getMovies action');
    dispatch(getMovies());
  }, [dispatch]);

  const isFavorited = (movie: Movie) => favorites.some((fav: FavoriteItem) => fav.id === movie.id && fav.type === 'movie');

  const handleImageError = (movieId: number) => {
    setImageErrors(prev => new Set(prev).add(movieId));
  };

  const displayedMovies = showAll ? movies : movies.slice(0, 4);

  if (status === 'loading') return (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">Loading movies...</p>
    </div>
  );
  if (status === 'failed') return (
    <div className="text-center py-12 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-3xl p-8">
      <p className="text-lg font-semibold">Error: {error}</p>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold mb-10 text-transparent bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text">🎬 Popular Movies</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {displayedMovies.map((movie: Movie) => (
          <li key={movie.id} className="bg-gradient-to-br from-white via-purple-50 to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-black p-6 rounded-3xl shadow-xl border border-purple-200/50 dark:border-purple-500/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center group">
            {movie.poster_path && !imageErrors.has(movie.id) ? (
              <div className="mb-4 rounded-2xl shadow-lg w-40 h-60 relative overflow-hidden group-hover:scale-105 transition-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
                  alt={movie.title} 
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(movie.id)}
                />
              </div>
            ) : (
              <div className="mb-4 rounded-2xl shadow-lg w-40 h-60 bg-gradient-to-br from-purple-200 to-violet-200 dark:from-purple-800 dark:to-violet-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎬</div>
                  <div className="text-xs text-purple-600 dark:text-purple-300 font-medium">Movie Poster</div>
                </div>
              </div>
            )}
            <div className="text-xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100">{movie.title}</div>
            <div className="text-sm text-purple-600 dark:text-purple-400 mb-2">Rating: {movie.vote_average}</div>
            <div className="text-gray-600 dark:text-gray-300 text-center mb-4">{movie.overview?.slice(0, 100)}...</div>
            <button
              className={`px-8 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mt-auto ${
                isFavorited(movie)
                  ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600'
                  : 'bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600'
              }`}
              onClick={() =>
                isFavorited(movie)
                  ? dispatch(removeFavorite(getFavoriteId({ ...movie, type: 'movie' })))
                  : dispatch(addFavorite({ 
                      ...movie, 
                      type: 'movie',
                      description: movie.overview,
                      url: `https://www.themoviedb.org/movie/${movie.id}`
                    }))
              }
            >
              {isFavorited(movie) ? '💜 Remove Favorite' : '🤍 Add to Favorites'}
            </button>
          </li>
        ))}
      </ul>
      
      {/* View More Button */}
      {movies.length > 4 && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <span className="text-lg">
              {showAll ? '👆 Show Less' : '👇 View More'}
            </span>
            <span className={`text-2xl transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`}>
              ➡️
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MoviesFeed; 