# McRecycle

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-13-lightgrey)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2-yellow)](https://supabase.io/)
[![Clerk](https://img.shields.io/badge/Clerk-4-orange)](https://clerk.dev/)

A game made by Pixel Minds using React 18, Next.js 13, Supabase 2, and Clerk 4.

## Play the game

You can play an online hosted version though vercel here:

https://pixel-minds.vercel.app

## Installation

Clone the project and navigate to its directory:

```shell
git clone https://gitlab.com/victorwp/pixel-minds.git
cd pixel-minds

Install the dependencies
npm install

make a .env.local file and insert the fowllowing lines:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY={YOUR_KEY}
CLERK_SECRET_KEY={YOUR_KEY}
NEXT_PUBLIC_SUPABASE_URL={YOUR_KEY}
NEXT_PUBLIC_SUPABASE_ANON_KEY={YOUR_KEY}

Replace {YOUR_KEY} with your actual enviroment variable


Start a local development server on port 3000
npm run dev

```

Open your browser and visit http://localhost:3000 to access the game.
