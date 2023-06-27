import { FC, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useDarkMode } from './DarkModeContext';
import Link from 'next/link';

const Header: FC = (): JSX.Element => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <header className={`${darkMode ? 'dark:bg-dark-200' : 'bg-gray-200'} py-8 flex items-center justify-between ${darkMode ? 'dark:text-white' : 'text-gray-800'}`}>
      <Link href={'/'}>
        <h1 className="text-2xl mx-5 text-center font-semibold">Book Recommendation</h1>
      </Link>
      <button
        className="flex items-center bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
        onClick={toggleDarkMode}
      >
        <span className={`mr-2 ${darkMode ? 'dark:text-white' : 'text-gray-800'}`}>
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </span>
        {darkMode ? <span className={`${darkMode ? 'dark:text-white' : 'text-gray-800'}`}>Light Mode </span> : <span className={`${darkMode ? 'dark:text-white' : 'text-gray-800'}`}>Dark Mode</span>}
      </button>
    </header>
  );
};

export default Header;
