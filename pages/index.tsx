import React from 'react';
import Layout from '../components/Layout';
import SearchSection from '../components/SearchSection';
import Recommendations from '../components/Recommendations';
import { BsPlus } from 'react-icons/bs';
import Link from 'next/link';
import { useDarkMode } from '@/components/DarkModeContext';

export default function Home() {
  const { darkMode } = useDarkMode();
  return (
    <Layout>
      <SearchSection />
      <h3 className="text-2xl text-center font-semibold mt-8 mb-10">Reccommendations are here</h3>

      <Recommendations/>


    <Link href="/add-recommendation">
      <button className={`mt-10 ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white': 'bg-gray-200 hover:bg-gray-300 text-dark '} font-semibold py-3 px-6 rounded-full flex items-center`}>
        <span className="mr-2">Add a recommendation</span>
        <BsPlus size={20} />
      </button>
    </Link>
    </Layout>
  );
}
