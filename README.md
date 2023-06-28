# Book Recommendation

The Book Recommendation project is a web application that allows users to discover and recommend books. It provides a platform for users to share their favorite books, explore recommendations from others. The project is live and hosted on [https://book-recommendation-sigma.vercel.app/](https://book-recommendation-sigma.vercel.app/).
A cloud MySql database is used for the live porject. 
## Features

- **Single Codebase**: The project is built using the React framework Next.js, which enables a single codebase for both the frontend and backend. This approach simplifies development and deployment processes.

- **Type Safety**: TypeScript is used for enhanced type safety, providing a better development and maintenance experience by catching potential errors at compile-time.

- **Styling with Tailwind CSS**: The project leverages Tailwind CSS, a utility-first CSS framework, for styling. This approach allows for rapid and consistent UI development.

- **Dark Mode**: A Dark Mode feature is implemented to enhance the user experience and provide an alternative visual theme for users who prefer darker interfaces.

- **Search Optimization**: The project incorporates a Debounce hook to optimize search functionality, reducing unnecessary API requests and improving performance.

## Getting Started for local development

To run locally , set up a mysql  database locally connect using user name, password & host inside the sequelize.js file. OR you could use a .env file. Then use the env variables inside sequielize.js file.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
