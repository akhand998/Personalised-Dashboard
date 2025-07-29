import apiService from '../services/api';

export async function fetchNews(category: string = 'general') {
  try {
    // Use our secure server instead of calling external API directly
    const articles = await apiService.getNews(category);
    return articles;
  } catch (error) {
    console.error('Failed to fetch news:', error);
    throw new Error('Failed to fetch news');
  }
} 