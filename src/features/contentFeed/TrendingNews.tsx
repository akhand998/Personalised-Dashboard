'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../../store';

// Define types for data
interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source?: {
    name: string;
  };
}

interface Movie {
  title: string;
  overview: string;
  vote_average: number;
}

const TrendingNews: React.FC = () => {
  const { articles, status: newsStatus, error: newsError } = useSelector((state: RootState) => state.news);
  const { movies, status: moviesStatus, error: moviesError } = useSelector((state: RootState) => state.movies);
  const trendingNews = articles.slice(0, 5);
  const trendingMovies = movies.slice(0, 5);

  if (newsStatus === 'loading' || moviesStatus === 'loading') return (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">Loading trending content...</p>
    </div>
  );
  if (newsStatus === 'failed' || moviesStatus === 'failed') return (
    <div className="text-center py-12 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-3xl p-8">
      <p className="text-lg font-semibold">Error: {newsError || moviesError}</p>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold mb-10 text-transparent bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text">🔥 Trending</h2>
      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-300">Trending News</h3>
        <ul className="space-y-8">
          {trendingNews.map((article: NewsArticle, idx: number) => (
            <li key={idx} className="bg-gradient-to-br from-white via-purple-50 to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-black p-6 rounded-3xl shadow-xl border border-purple-200/50 dark:border-purple-500/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="flex items-start gap-6">
                <div className="bg-gradient-to-br from-purple-500 to-violet-500 text-white rounded-2xl w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-2xl font-bold hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-4 block group-hover:scale-105 text-gray-900 dark:text-gray-100">
                    {article.title}
                  </a>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-3">
                    <span className="bg-purple-100 dark:bg-purple-900/50 px-3 py-1 rounded-full text-xs font-medium text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-500/30">
                      {article.source?.name}
                    </span>
                    <span className="text-purple-400 dark:text-purple-300">•</span>
                    <span className="text-gray-400 dark:text-gray-500">Trending</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{article.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-300">Trending Movies</h3>
        <ul className="space-y-8">
          {trendingMovies.map((movie: Movie, idx: number) => (
            <li key={idx} className="bg-gradient-to-br from-white via-purple-50 to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-black p-6 rounded-3xl shadow-xl border border-purple-200/50 dark:border-purple-500/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="flex items-start gap-6">
                <div className="bg-gradient-to-br from-purple-500 to-violet-500 text-white rounded-2xl w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{movie.title}</div>
                  <div className="text-sm text-purple-600 dark:text-purple-400 mb-4">Rating: {movie.vote_average}</div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{movie.overview?.slice(0, 150)}...</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrendingNews; 