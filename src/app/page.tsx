'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSession, signOut } from 'next-auth/react';
import PreferencesPanel from '../features/preferences/PreferencesPanel';
import NewsFeed from '../features/contentFeed/NewsFeed';
import MoviesFeed from '../features/contentFeed/MoviesFeed';
import DashboardLayout from '../components/DashboardLayout';
import TrendingNews from '../features/contentFeed/TrendingNews';
import { RootState } from '../store';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { setFavorites } from '../store/preferencesSlice';

function useDebouncedValue(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useMemo(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

// Helper to get a unique id for each favorite
const getFavoriteId = (item: any) =>
  item.type === 'movie' ? `movie-${item.id}` : `news-${item.url}`;

function SortableFavorite({ item, idx, id }: { item: any; idx: number; id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };
  return (
    <li 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className="bg-gradient-to-br from-white via-purple-50 to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-black p-6 rounded-3xl shadow-xl border border-purple-200/50 dark:border-purple-500/20 mb-4 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="flex items-start gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-violet-500 text-white rounded-2xl w-10 h-10 flex items-center justify-center font-bold text-sm shadow-lg flex-shrink-0">
          {idx + 1}
        </div>
        <div className="flex-1">
          <div className="mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-bold mr-2 ${
              item.type === 'movie'
                ? 'bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border border-blue-300/50 dark:border-blue-500/30'
                : 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-200 border border-green-300/50 dark:border-green-500/30'
            }`}>
              {item.type === 'movie' ? 'Movie' : 'News'}
            </span>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xl font-bold hover:text-purple-600 dark:hover:text-purple-400 transition-colors group-hover:scale-105 text-gray-900 dark:text-gray-100">
              {item.title}
            </a>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-3">
            <span className="bg-purple-100 dark:bg-purple-900/50 px-3 py-1 rounded-full text-xs font-medium text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-500/30">
              {item.source?.name}
            </span>
            <span className="text-purple-400 dark:text-purple-300">•</span>
            <span className="text-gray-400 dark:text-gray-500">Favorite</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.description}</p>
        </div>
      </div>
    </li>
  );
}

export default function DashboardPage() {
  const [section, setSection] = useState('feed');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebouncedValue(searchTerm, 400);
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.preferences.favorites) || [];
  const { data: session, status } = useSession();

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = favorites.findIndex((item: any) => getFavoriteId(item) === active.id);
      const newIndex = favorites.findIndex((item: any) => getFavoriteId(item) === over.id);
      const newFavorites = arrayMove(favorites, oldIndex, newIndex);
      dispatch(setFavorites(newFavorites));
    }
  }, [favorites, dispatch]);

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 dark:from-gray-950 dark:via-gray-900 dark:to-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 dark:from-gray-950 dark:via-gray-900 dark:to-black">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Your Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please sign in to access your personalized dashboard
          </p>
          <a
            href="/auth/signin"
            className="inline-block bg-gradient-to-r from-purple-500 to-violet-500 text-white px-8 py-3 rounded-2xl font-semibold hover:from-purple-600 hover:to-violet-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  let content;
  if (section === 'feed') {
    content = <>
      <PreferencesPanel />
      <NewsFeed searchTerm={debouncedSearch} />
      <MoviesFeed />
    </>;
  } else if (section === 'trending') {
    content = <TrendingNews />;
  } else if (section === 'favorites') {
    content = (
      <div className="w-full max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-transparent bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text">⭐ My Favorites</h2>
        {favorites.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-white via-purple-50 to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-black rounded-3xl shadow-xl border border-purple-200/50 dark:border-purple-500/20">
            <div className="text-6xl mb-4">💜</div>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-2">No favorites yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Start adding articles to your favorites to see them here!</p>
          </div>
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={favorites.map(getFavoriteId)} strategy={verticalListSortingStrategy}>
              <ul className="space-y-4">
                {favorites.map((item: any, idx: number) => (
                  <SortableFavorite key={getFavoriteId(item)} id={getFavoriteId(item)} item={item} idx={idx} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>
    );
  }

  return (
    <DashboardLayout
      currentSection={section}
      onSectionChange={setSection}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {session?.user?.email}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your personalized dashboard is ready
          </p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Logout
        </button>
      </div>
      {content}
    </DashboardLayout>
  );
}
