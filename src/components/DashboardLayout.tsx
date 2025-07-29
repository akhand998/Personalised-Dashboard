'use client';

import React from 'react';

const navItems = [
  { label: 'Feed', value: 'feed', icon: '📰' },
  { label: 'Trending', value: 'trending', icon: '🔥' },
  { label: 'Favorites', value: 'favorites', icon: '⭐' },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentSection: string;
  onSectionChange: (section: string) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentSection, onSectionChange, searchTerm, onSearchTermChange }) => {
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 h-screen fixed left-0 top-0 z-20 bg-gradient-to-b from-purple-600 via-violet-600 to-fuchsia-600 text-white shadow-2xl flex flex-col p-8">
        <div className="text-3xl font-extrabold mb-12 tracking-tight flex items-center gap-3">
          <span className="bg-white/20 rounded-full px-4 py-2 text-2xl">✨</span>
          <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Dashboard</span>
        </div>
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => onSectionChange(item.value)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-semibold text-lg group
                ${currentSection === item.value
                  ? 'bg-white/95 text-purple-700 shadow-xl scale-105'
                  : 'hover:bg-white/20 hover:text-purple-200 hover:scale-105'
                }
              `}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col ml-64 h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <header className="sticky top-0 z-10 h-24 bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 shadow-2xl flex items-center px-12 justify-between">
          <div className="w-2/3">
            <input
              type="text"
              placeholder="Search for news and content..."
              className="w-full px-6 py-4 rounded-2xl border-none bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-gray-100 shadow-lg focus:ring-4 focus:ring-purple-400/50 focus:outline-none transition-all duration-300 text-lg placeholder-gray-500 dark:placeholder-gray-400"
              value={searchTerm}
              onChange={e => onSearchTermChange(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-xl hover:scale-110 transition-transform">
              <span className="text-xl">👤</span>
            </div>
          </div>
        </header>
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-12 bg-gray-50 dark:bg-gray-950">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 