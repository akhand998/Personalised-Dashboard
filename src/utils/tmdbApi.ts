import apiService from '../services/api';

export async function fetchPopularMovies() {
  try {
    console.log('TMDB API: Starting to fetch movies');
    // Use our secure server instead of calling external API directly
    const movies = await apiService.getMovies();
    console.log('TMDB API: Successfully fetched movies:', movies);
    return movies;
  } catch (error) {
    console.error('TMDB API: Failed to fetch movies:', error);
    throw new Error('Failed to fetch movies');
  }
} 