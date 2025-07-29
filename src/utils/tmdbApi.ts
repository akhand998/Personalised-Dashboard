import apiService from '../services/api';

export async function fetchPopularMovies() {
  try {
    // Use our secure server instead of calling external API directly
    const movies = await apiService.getMovies();
    return movies;
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    throw new Error('Failed to fetch movies');
  }
} 