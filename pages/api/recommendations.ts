import { NextApiRequest, NextApiResponse } from 'next';
import Recommendation from '../../models/recommendation';
import sequelize from '@/sequelize';

const PAGE_SIZE = 9;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Run the sync method to create the table if it doesn't exist
    await Recommendation.sync();

    if (req.method === 'GET') {
      const { page, id, bookId } = req.query;
      const pageNumber = parseInt(page as string) || 1;
    
      // Calculate the offset and limit based on the page number and page size
      const offset = (pageNumber - 1) * PAGE_SIZE;
      const limit = PAGE_SIZE;
    
      if (id) {
        // If an ID is provided, retrieve the specific recommendation by ID
        const recommendation = await Recommendation.findByPk(id as string);

        if (!recommendation) {
          return res.status(404).json({ message: 'Recommendation not found' });
        }

        return res.status(200).json(recommendation);
      }



      // Retrieve recommendations with pagination from the Recommendation table
      const { count, rows: recommendations } = await Recommendation.findAndCountAll({
        offset,
        limit,
        order: [['updatedAt', 'DESC']],
      });
    
      const totalPages = Math.ceil(count / PAGE_SIZE);
    
      if (recommendations.length === 0) {
        res.setHeader('Cache-Control', 'no-store'); // Disable caching for empty response
        return res.status(200).json({ message: 'No data found', totalPages });
      }
    
      // Get the total count of recommendations for each bookId
      const bookIdCounts = await Recommendation.findAll({
        attributes: ['bookId', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['bookId'],
      });
    
      // Create a map to store the counts by bookId
      const bookIdCountMap = new Map();
      bookIdCounts.forEach((count:any) => {
        bookIdCountMap.set(count.bookId, count.get('count'));
      });
    
      // Update the recommendations array with the recommendation count
      const updatedRecommendations = recommendations.map((recommendation) => {
        const bookId = recommendation.get('bookId');
        let recommendationsCount = '' 
        if(bookId){
            const recommendationCount = bookIdCountMap.get(bookId);
            recommendationsCount = recommendationCount 
        }
        return {
          ...recommendation.toJSON(),
          recommendationsCount,
        };
      });
    
    //   let uniqueRecommendations =  Object.values(
    //     updatedRecommendations.reduce((acc, obj) => ({ ...acc, [obj.bookId]: obj }), {})
    // );

      res.setHeader('Cache-Control', 'no-store'); // Disable caching for successful response
      return res.status(200).json({ recommendations: updatedRecommendations, totalPages });
    }else if (req.method === 'POST') {
      // Handle the POST request to create a new recommendation
      const { userName, bookName, author, cover, shortDescription, bookId } = req.body;
    
      try {
        // Check if a recommendation with the same bookId already exists
        const existingRecommendation = await Recommendation.findOne({ where: {id : bookId } });
    
        if (existingRecommendation) {
          // Update the existing recommendation with the new bookId value
          await existingRecommendation.update({ bookId });
    
        }
    
        // Create a new recommendation in the database
        const newRecommendation = await Recommendation.create({
          userName,
          bookName,
          author,
          cover,
          shortDescription,
          bookId
        });
    
        return res.status(201).json(newRecommendation);
      } catch (error) {
        console.error('Error creating/updating recommendation:', error);
        return res.status(500).json({ message: 'Error creating/updating recommendation' });
      }
    }
     else {
      // Return an error response for unsupported methods
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error handling recommendation request:', error);
    return res.status(500).json({ message: 'An error occurred while handling the recommendation request' });
  }
}
