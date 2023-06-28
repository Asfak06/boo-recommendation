import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsArrowLeft, BsArrowRight, BsHourglassSplit } from 'react-icons/bs';
import { useDarkMode } from './DarkModeContext';
import Image from 'next/image';
import Link from 'next/link';

interface Recommendation {
  id: number;
  title: string;
  bookName: string;
  author: string;
  cover: string;
  recommendationsCount: number;
  bookId: string;
  userName: string;
}

const Recommendations = (): JSX.Element => {
  const { darkMode } = useDarkMode();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch recommendations when the component mounts
    fetchRecommendations(currentPage);
  }, []);

  const fetchRecommendations = async (page: number) => {
    try {
      setIsLoading(true);

      const response = await axios.get(`/api/recommendations?page=${page}`);
      const { data } = response;

      if (!data || !data.recommendations) {
        // Handle the case when recommendations are not available
        setRecommendations([]);
        setTotalPages(1);
        setIsLoading(false);
        return;
      }

      setRecommendations(data.recommendations);
      setTotalPages(data.totalPages);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setIsLoading(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchRecommendations(currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchRecommendations(currentPage + 1);
      setCurrentPage(currentPage + 1);
    }
  };

  const cardStyles = ` p-4 rounded shadow border-solid border-2  ${
    darkMode ? 'dark:bg-dark border-dark' : 'bg-white border-light'
  }`; // Add a custom dark mode class if needed

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <BsHourglassSplit className="animate-spin text-4xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recommendations.map((recommendation, i) => (
          <Link key={recommendation.id} href={`/details/${recommendation.bookId || recommendation.id}`}>
            <div className={cardStyles}>
              {recommendation.cover ? (
                <img
                  src={recommendation.cover}
                  alt="Book Cover"
                  className="w-full h-auto object-cover object-center mb-4"
                  style={{ aspectRatio: '1/1' }}
                />
              ) : (
                <img
                  src={'http://via.placeholder.com/200x200'}
                  alt="Book Cover"
                  className="w-full h-auto object-cover object-center mb-4"
                  style={{ aspectRatio: '1/1' }}
                />
              )}

              <h3 className="text-lg font-semibold mb-2">{recommendation.title || recommendation.bookName}</h3>
              <p className=" mb-2">By {recommendation.author}</p>
              {recommendation.recommendationsCount ? (
                <p className="">
                  {recommendation.recommendationsCount} Recommendations <br />
                  Recommended by {recommendation.userName}
                </p>
              ) : (
                <p className="">Recommended by {recommendation.userName}</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-5 flex justify-center">
        <button
          className={`${
            darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-dark-100'
          } font-semibold py-2 px-4 rounded mr-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handlePrevPage}
          disabled={currentPage === 1 || isLoading}
        >
          <BsArrowLeft className="inline-block mr-1" />
          Previous
        </button>
        <button
          className={`${
            darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-dark-100'
          } font-semibold py-2 px-4 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages || isLoading}
        >
          Next
          <BsArrowRight className="inline-block ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Recommendations;
