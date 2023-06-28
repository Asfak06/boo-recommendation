import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDebounce } from 'use-debounce';
import { useDarkMode } from './DarkModeContext';
import Link from 'next/link';
import { BsHourglassSplit } from 'react-icons/bs';

const SearchSection = () => {
  const { darkMode } = useDarkMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>([]);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500); // Debounce the search query with a delay of 500ms
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (debouncedSearchQuery) {
      fetchSearchResults();
    } else {
      setSearchResults([]); 
    }
  }, [debouncedSearchQuery]);

  const fetchSearchResults = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${debouncedSearchQuery}`);
      const { items } = response.data;
      const formattedResults = items.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Unknown Author',
        coverImage: item.volumeInfo.imageLinks?.thumbnail || '',
      }));
      setSearchResults(formattedResults);
    } catch (error) {
      setError('Error fetching search results');
    } finally {
      setIsLoading(false);
    }
  };
  

  const inputStyles = `w-full rounded-lg my-5 py-2 px-4 outline-none focus:ring-2 ${
    darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'
  }`;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="py-2 px-4">
      <input
        type="text"
        placeholder="Search books..."
        className={inputStyles}
        value={searchQuery}
        onChange={handleInputChange}
      />
      {isLoading &&     
       <div className="flex items-center justify-center h-full">
        <BsHourglassSplit className="animate-spin text-4xl" />
      </div>}
      {error && <p>{error}</p>}
      <ul>
        {searchResults.map((result: any) => (
          <li key={result.id} className={`cursor-pointer mt-2 ${darkMode ? 'dark:hover:bg-gray-800': 'hover:bg-gray-100' }  rounded p-2`}>
            <Link href={`/details/${result.id}`} onClick={()=>setSearchResults([])}>
              <div className="flex items-center space-x-4">
                <img src={result.coverImage} alt="Book Cover" className="w-16 h-24" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">{result.title}</h3>
                  <p className="text-gray-500">By {result.author}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default SearchSection;
