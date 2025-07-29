'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export default function DarkModeSync() {
  const darkMode = useSelector((state: RootState) => state.preferences.darkMode);

  useEffect(() => {
    console.log('DarkModeSync: darkMode changed to:', darkMode);
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      console.log('DarkModeSync: Current html classes:', html.className);
      
      if (darkMode) {
        html.classList.add('dark');
        console.log('DarkModeSync: Added dark class to html');
        console.log('DarkModeSync: New html classes:', html.className);
      } else {
        html.classList.remove('dark');
        console.log('DarkModeSync: Removed dark class from html');
        console.log('DarkModeSync: New html classes:', html.className);
      }
    }
  }, [darkMode]);

  // Also log on mount
  useEffect(() => {
    console.log('DarkModeSync: Component mounted, darkMode is:', darkMode);
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      console.log('DarkModeSync: Initial html classes:', html.className);
    }
  }, [darkMode]);

  return null;
} 