'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNews } from './newsSlice';
import { RootState } from '../../store';
import { addFavorite, removeFavorite } from '../../store/preferencesSlice';

interface NewsFeedProps {
  searchTerm?: string;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ searchTerm = '' }) => {
  const dispatch = useDispatch();
  const { articles, status, error } = useSelector((state: RootState) => state.news);
  const { categories, favorites = [] } = useSelector((state: RootState) => state.preferences);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Use the first selected category or 'general' as default
    const category = categories[0] || 'general';
    dispatch(getNews(category) as any);
  }, [dispatch, categories]);

  const filteredArticles = articles.filter((article: any) => {
    const text = (article.title + ' ' + article.description).toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const displayedArticles = showAll ? filteredArticles : filteredArticles.slice(0, 4);

  const isFavorited = (article: any) => favorites.some((fav: any) => fav.url === article.url);

  if (status === 'loading') return (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">Loading news...</p>
    </div>
  );
  if (status === 'failed') return (
    <div className="text-center py-12 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-3xl p-8">
      <p className="text-lg font-semibold">Error: {error}</p>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold mb-10 text-transparent bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text">📰 News Feed</h2>
      <ul className="space-y-8">
        {displayedArticles.map((article: any, idx: number) => (
          <li key={idx} className="bg-gradient-to-br from-white via-purple-50 to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-black p-8 rounded-3xl shadow-xl border border-purple-200/50 dark:border-purple-500/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-2xl font-bold hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-4 block group-hover:scale-105 text-gray-900 dark:text-gray-100">
              {article.title}
            </a>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-3">
              <span className="bg-purple-100 dark:bg-purple-900/50 px-3 py-1 rounded-full text-xs font-medium text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-500/30">
                {article.source?.name}
              </span>
              <span className="text-purple-400 dark:text-purple-300">•</span>
              <span className="text-gray-400 dark:text-gray-500">Latest News</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-lg">{article.description}</p>
            <button
              className={`px-8 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isFavorited(article)
                  ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600'
                  : 'bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600'
              }`}
              onClick={() =>
                isFavorited(article)
                  ? dispatch(removeFavorite(article.url))
                  : dispatch(addFavorite(article))
              }
            >
              {isFavorited(article) ? '💜 Remove Favorite' : '🤍 Add to Favorites'}
            </button>
          </li>
        ))}
      </ul>
      
      {/* View More Button */}
      {filteredArticles.length > 4 && (
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

export default NewsFeed; 