import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDarkMode } from '@/components/DarkModeContext';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { BsArrowLeft, BsPlus, BsHourglassSplit } from 'react-icons/bs';
import Link from 'next/link';
import { Parser } from 'html-to-react';
import SearchSection from '@/components/SearchSection';

interface Props {}

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
}

const Details: NextPage<Props> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState('');

  const { darkMode } = useDarkMode();
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState<Book | null>(null);
  const htmlParser = Parser();
  useEffect(() => {
    if (id) {
      fetchBookDetails(id as string);
    }
  }, [id]);

  const fetchBookDetails = async (bookId: string) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
      const bookData = response.data.volumeInfo;
      const bookDetails: Book = {
        id: bookId,
        title: bookData.title,
        author: bookData.authors ? bookData.authors.join(', ') : 'Unknown Author',
        coverImage: bookData.imageLinks?.thumbnail || '',
        description: bookData.description || '',
      };
      setBook(bookDetails);
    } catch (error) {
      try {
        const response = await axios.get(`/api/recommendations?id=${bookId}`);
        const bookData = response.data;
        const bookDetails: Book = {
          id: bookData.id,
          title: bookData.bookName,
          author: bookData.author,
          coverImage: bookData.cover || '',
          description: bookData.shortDescription || '',
        };
        setBook(bookDetails);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
      console.error('Error fetching book details:', error);
    }
  };

  if (!book) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <BsHourglassSplit className="animate-spin text-4xl" />
        </div>
      </Layout>
    );
  }

  const handleAddToRecommendation = () => {
    setIsModalOpen(true);
  };

  const handleSubmitRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      // Make the POST request to save the data
      await axios.post('/api/recommendations', {
        bookId: book.id,
        userName: userName,
        bookName: book.title,
        author: book.author,
        cover: book.coverImage,
        shortDescription: book.description,
      });

      // Reset the form and show the success message
      setIsLoading(false);
      setIsSuccess(true);
      closeModal();
    } catch (error) {
      console.error('Error adding book to recommendation:', error);
      // Handle the error case if needed
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserName('');
  };

  return (
    <Layout>
      <SearchSection />
      <br />
      <div className="py-8 px-4">
        <div className="flex items-center justify-center mb-8">
          {book.coverImage ? (
            <img src={book.coverImage} alt="Book Cover" className="w-64 h-auto" />
          ) : (
            <img src={'http://via.placeholder.com/1000x700'} alt="Book Cover" className="w-auto h-auto" />
          )}
        </div>

        <h2 className="text-2xl font-semibold mb-2">{book.title}</h2>
        <p className="text-gray-500 mb-4">By {book.author}</p>
        <div className={`prose ${darkMode ? 'prose-dark' : 'prose-light'}`}>
          <p>{htmlParser.parse(book.description)}</p>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          className={`mt-10 w-auto ${
            darkMode
              ? 'bg-gray-800 hover:bg-gray-700 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-dark'
          } flex items-center justify-center font-semibold py-2 px-4 rounded-full`}
          onClick={handleAddToRecommendation}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="mr-2">Adding...</span>
          ) : (
            <span className="mr-2">Add to recommendation</span>
          )}
          <BsPlus size={20} />
        </button>

        <Link href="/">
          <span
            className={`mt-10 w-auto ${
              darkMode
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-black'
            } flex items-center justify-centerfont-semibold py-2 px-4 rounded`}
          >
            <BsArrowLeft size={20} className="mr-1" />
            Go Back
          </span>
        </Link>
      </div>

      {isModalOpen && (
              <div className={`fixed inset-0 flex items-center justify-center z-50 ${darkMode ? 'bg-opacity-80 bg-black' : 'bg-opacity-50 bg-gray-400'}`}>
                  <div className={`bg-white dark:bg-gray-800 w-1/2 p-6 rounded shadow ${darkMode ? 'text-white' : 'text-black'}`}>
                      <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>Add Recommendation</h2>
                      <form onSubmit={handleSubmitRecommendation}>
                          <input
                              type="text"
                              placeholder="Enter your name"
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                              className={`border ${darkMode ? 'border-gray-700' : 'border-gray-300'} rounded-md px-4 py-2 mb-4 w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                          />
                          <div className="flex justify-end">
                              <button
                                  type="button"
                                  className={`mr-2 px-4 py-2 ${darkMode ? 'text-gray-300 hover:text-gray-400' : 'text-gray-500 hover:text-gray-700'}`}
                                  onClick={closeModal}
                              >
                                  Cancel
                              </button>
                              <button
                                  type="submit"
                                  className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${darkMode ? 'hover:bg-blue-700' : ''}`}
                              >
                                  Submit
                              </button>
                          </div>
                      </form>
                  </div>
</div>
      )}

      {isSuccess && <div className="text-green-500 mt-2">Book added to recommendation successfully!</div>}
    </Layout>
  );
};

export default Details;
