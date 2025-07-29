'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setCategories, toggleDarkMode } from '../../store/preferencesSlice';

const allCategories = ['Technology', 'Sports', 'Finance', 'Movies', 'Music', 'Health'];

const PreferencesPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { categories, darkMode } = useSelector((state: RootState) => state.preferences);
  const [selected, setSelected] = useState<string[]>(categories);

  const handleCategoryChange = (category: string) => {
    let updated;
    if (selected.includes(category)) {
      updated = selected.filter((c) => c !== category);
    } else {
      updated = [...selected, category];
    }
    setSelected(updated);
    dispatch(setCategories(updated));
  };

  const handleDarkModeToggle = () => {
    console.log('PreferencesPanel: Toggling dark mode, current state:', darkMode);
    dispatch(toggleDarkMode());
  };

  return (
    <div className="p-10 bg-gradient-to-br from-white via-purple-50 to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-black rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-500/20 max-w-3xl mx-auto mb-10">
      <h2 className="text-3xl font-bold mb-8 text-transparent bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text">⚙️ Preferences</h2>
      <div className="mb-8">
        <div className="font-semibold mb-6 text-gray-800 dark:text-gray-100 text-lg">Categories:</div>
        <div className="grid grid-cols-2 gap-4">
          {allCategories.map((cat) => (
            <label key={cat} className="flex items-center gap-4 cursor-pointer p-4 rounded-2xl hover:bg-purple-100 dark:hover:bg-gray-800/50 transition-all duration-300 group border border-transparent dark:border-gray-700/50">
              <input
                type="checkbox"
                checked={selected.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
                className="w-6 h-6 accent-purple-600 dark:accent-purple-400 rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600"
              />
              <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-100 to-violet-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-3xl border border-purple-200/50 dark:border-gray-600/50">
        <span className="font-semibold text-gray-800 dark:text-gray-100 text-lg">Dark Mode:</span>
        <button
          onClick={handleDarkModeToggle}
          className={`w-16 h-8 rounded-full flex items-center transition-all duration-300 shadow-lg ${
            darkMode ? 'bg-gradient-to-r from-purple-500 to-violet-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <span
            className={`inline-block w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${
              darkMode ? 'translate-x-8' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default PreferencesPanel; 