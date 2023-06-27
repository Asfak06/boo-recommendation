import { NextPage } from 'next';
import { useState } from 'react';
import axios from 'axios';
import { useDarkMode } from '@/components/DarkModeContext';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';

interface BookSuggestion {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string;
  description: string;
  bookId:string;
}

interface Props {}

const AddRecommendation: NextPage<Props> = () => {
  const { darkMode } = useDarkMode();
  const [userName, setUserName] = useState('');
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [cover, setCover] = useState('');
  const [bookId, setBookId] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);

  const handleBookNameChange = (value: string) => {
    setBookName(value);

    if (value.trim() !== '') {
      fetchBookSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const fetchBookSuggestions = async (query: string) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`
      );
      const suggestions = response.data.items.map((item: any) => {
        return {
          id: item.id,
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors || [],
          thumbnail: item.volumeInfo.imageLinks?.thumbnail || '',
          description: item.volumeInfo.description || '',
        };
      });
      setSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching book suggestions:', error);
    }
  };

  const handleBookSuggestionSelect = async (selectedBook: BookSuggestion) => {
    setBookId(selectedBook.id);
    setBookName(selectedBook.title);
    setAuthor(selectedBook.authors.join(', '));
    setCover(selectedBook.thumbnail);
    setShortDescription(selectedBook.description);
    setSuggestions([]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const recommendationData = {
        userName,
        bookName,
        author,
        cover,
        shortDescription,
        bookId
      };

      await axios.post('/api/recommendations', recommendationData);
      setSuccessMessage('Recommendation added successfully!');
      // Reset form fields
      setUserName('');
      setBookName('');
      setAuthor('');
      setCover('');
      setShortDescription('');
    } catch (error) {
      console.error('Error adding recommendation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-4">Add a Recommendation</h2>
        {successMessage && (
          <div className="mb-4 text-green-600 font-semibold">{successMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <label htmlFor="userName" className="block mb-2">
            User Name:
          </label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className={` ${darkMode ? 'text-black' : 'bg-gray-200'} w-full rounded-lg py-2 px-4 outline-none focus:ring-2`}
            required
          />

          <label htmlFor="bookName" className="block mt-4 mb-2">
            Book Name:
          </label>
          <input
            type="text"
            id="bookName"
            value={bookName}
            onChange={(e) => handleBookNameChange(e.target.value)}
            className={` ${darkMode ? 'text-black' : 'bg-gray-200'} w-full rounded-lg py-2 px-4 outline-none focus:ring-2`}
            required
          />
          {suggestions.length > 0 && (
            <ul className={`mt-2 p-2 ${darkMode ? 'bg-gray-800 text-white':'bg-gray-200' } rounded`}>
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  className="cursor-pointer hover:bg-gray-400 p-1 rounded-md my-1"
                  onClick={() => handleBookSuggestionSelect(suggestion)}
                >
                  <span>{suggestion.title.slice(0, 50)}{suggestion.title.length>50 && '...'}</span>
  
                </li>
              ))}
            </ul>
          )}

          <label htmlFor="author" className="block mt-4 mb-2">
            Author:
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={` ${darkMode ? 'text-black' : 'bg-gray-200'} w-full rounded-lg py-2 px-4 outline-none focus:ring-2`}
            required
          />

          <label htmlFor="cover" className="block mt-4 mb-2">
            Cover Image URL:
          </label>
          <input
            type="text"
            id="cover"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            className={` ${darkMode ? 'text-black' : 'bg-gray-200'} w-full rounded-lg py-2 px-4 outline-none focus:ring-2`}
          />
          {cover && (
            <div className="mt-2">
              <img src={cover} alt="Book Cover" className="w-16 h-16 object-contain" />
            </div>
          )}

          <label htmlFor="shortDescription" className="block mt-4 mb-2">
            Short Description:
          </label>
          <textarea
            id="shortDescription"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className={` ${darkMode ? 'text-black' : 'bg-gray-200'} w-full rounded-lg py-2 px-4 outline-none focus:ring-2`}
          />

          <button
            type="submit"
            className={`mt-6 ${
              darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-dark'
            } font-semibold py-3 px-6 rounded-full`}
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Recommendation'}
          </button>
        </form>
        <div className="flex justify-end">
          <Link href="/">
            <span
              className={`mt-5 w-14  ${
                darkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-black'
              } flex items-center justify-centerfont-semibold py-2 px-4 rounded`}
            >
              <BsArrowLeft size={20} className="mr-1" />
            </span>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default AddRecommendation;
