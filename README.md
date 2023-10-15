# McRecycle
![McRecycle Screenshot](https://github.com/martintmv-git/mcrecycle/assets/101264514/a759067f-de49-4a29-9252-cbccc959296f)
## About the project

**McRecycle** is an innovative **Progressive Web Application** (PWA) game, developed by our team, **Pixel Minds**. This game merges fun and learning, encouraging McDonald's users to **boost their awareness of sustainability and recycling**. Our goal was to bring attention to the problem, while also keeping McDonalds customers **engaged and rewarded**.

## Project Overview

This project is a game designed to be played on both **mobile and desktop platforms**, providing a **hyper-casual gaming experience** to McDonald's users. The goal of the game is to collect falling waste derived from McDonald's packaging in a bin that's controlled by the user. Speed of the game is constantly increasing, each **150 points made**. Points received for each collected item are **25**. The player has **3 lives**, and when they lose all of them, the game ends.

In line with our mission to **boost customer loyalty**, we have introduced a leaderboard where players' scores are ranked and they compete for TOP 3's big awwards, and also a shop where the points earned can be exchanged for **food QR discount coupons** at McDonald's stores.

The game was designed using **Figma** and developed in the following stack:

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-13-lightgrey)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2-yellow)](https://supabase.io/)
[![Clerk](https://img.shields.io/badge/Clerk-4-orange)](https://clerk.dev/)

## Features

- **Fully Responsive Design**: The game layout adjusts to any screen size, making it playable on both mobile and desktop devices.
- **"Endless Runner" Gameplay**: Offers an engaging user experience that keeps you coming back for more.
- **No Password Authentication**: Uses Clerk for seamless, password-less authentication.
- **Leaderboard**: Show off your high scores and compete with other players.
- **Points Shop**: Earn and exchange your points for food discount coupons at McDonald's stores.

## Play the Game
```NOTE: As the project is now over, Supabase's DB is now shut down, but you can still test the gameplay, Scoreboard and Shop is unavailable currently.```

Visit [https://pixel-minds.vercel.app](https://pixel-minds.vercel.app) and choose one of the 5 ways to login and play the game.


If you want to log in using another way, click on **Sign Up** and then make an account. You need to make an account, so the **Leaderboards** and **Shop** work as intended. If you don't want to give your personal email or data, please just use [this website](https://10minutemail.com) for a **temporary 10 minute email**. (We **only store your first name** in our DataBase, if requested, we'll delete your data.)

## Installation

To run the game locally, follow these steps:

## 1. Clone the repository:

```shell
git clone https://gitlab.com/victorwp/pixel-minds.git
cd pixel-minds
```

## 2. Install the dependencies:

```shell
npm install
```
## 3. Make a .env.local file in the root of the project and insert the fowllowing lines:

```shell
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY={YOUR_KEY}
CLERK_SECRET_KEY={YOUR_KEY}
NEXT_PUBLIC_SUPABASE_URL={YOUR_KEY}
NEXT_PUBLIC_SUPABASE_ANON_KEY={YOUR_KEY}
```

**Replace {YOUR_KEY} with your actual enviroment variable**.


NOTE: We won't share our **Enviroment keys**, as API keys are private. If you want to run the project locally, you need to get your own keys from **Supabase** and **Clerk**. To fully test the app, you can just test the hosted version right [here](https://pixel-minds.vercel.app).


## 4. Start a local development server on port 3000:

```shell
npm run dev
```

After running the server, open your browser and visit [http://localhost:3000](http://localhost:3000) to access the game.

## Support

If you need assistance or have any questions, feel free to contact us through the issue tracker on GitHub or directly at work.martintmv@gmail.com.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
