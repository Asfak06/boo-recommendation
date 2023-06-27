import React, { ReactNode } from 'react';
import { useDarkMode } from './DarkModeContext';
import Header from './Header';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { darkMode } = useDarkMode();

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'dark:bg-gray-600' : 'bg-white'}`}>
      <Header />
      <main className={`flex-grow max-w-4xl mx-auto px-4 py-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {children}
      </main>
      <footer className={`${darkMode ? 'dark:bg-dark-200' : 'bg-gray-200'} py-4 flex-shrink-0 ${darkMode ? 'dark:text-white' : 'text-gray-800'}`}>
        <div className="text-center">
          &copy; {new Date().getFullYear()} Book Recommendation
        </div>
      </footer>
    </div>
  );
};

export default Layout;
