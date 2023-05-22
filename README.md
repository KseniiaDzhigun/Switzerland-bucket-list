# React Mesto API Full

React Mesto API Full is a full-stack web application that allows users to share and explore photos of different places in Switzerland, find ideas for future trips.

Users can sign up, log in, upload and delete their own photos, as well as like and dislike photos uploaded by other users.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Project domains](#project-domains)

## Project Description

React Mesto API Full is a full-stack web application developed using the MERN stack (MongoDB, Express.js, React.js, and Node.js).

The frontend is built using React.js, providing an interactive and responsive user interface. 

The backend is built using Node.js and Express.js, serving as the API server that handles authentication, photo management, and user profile operations. 

MongoDB is used as the database for storing and retrieval user information and photo data.

## Features

- User authentication: Users can sign up, log in, and log out.
- Photo management: Users can upload and delete their own photos.
- Likes and dislikes: Users can like or dislike photos uploaded by other users.
- User profile: Users can view and update their profile information, including their name, about section, and profile picture.

## Installation

To install and set up the project locally, follow these steps:

1. Clone the repository:
git clone https://github.com/KseniiaDzhigun/react-mesto-api-full.git

2. Navigate to the project directory:
cd react-mesto-api-full

3. Install the dependencies for both the backend and frontend:

  `cd backend
  npm install`

  `cd frontend
  npm install`

4. Create a `.env` file in the backend directory and provide the necessary environment variables. 

5. Start the backend server:

  `cd backend`
  `npm start`

6. Open a new terminal window, navigate to the frontend directory, and start the frontend development server:

  `cd frontend`
  `npm start`

The frontend application should now be running locally on `http://localhost:3000`, and it should be connected to the backend API server.

## API Endpoints

The backend server provides the following API endpoints:

|Method|Endpoint|Description|
|-|-|-|
|POST|`/signup`|Create a new user with email and password|
|POST|`/signin`|Log in an existing user, check email and password and return JWT|
|GET|`/signout`|Clear cookies|
|Protected Routes|
|GET|`/users`|Get a list of all users|
|GET|`/users/me`|Get information about the current user|
|GET|`/users/:id`|Get information about the specific user|
|PATCH|`/users/me/avatar`|Update the current user's profile picture|
|PATCH|`/users/me`|Update the current user's profile information|
|GET|`/cards`|Get a list of all photos|
|POST|`/cards`|Create a new photo|
|DELETE|`/cards/:id`|Delete a specific photo|
|PUT|`/cards/:cardId/likes`|Add a like on a specific photo|
|DELETE|`/cards/:cardId/likes`|Remove a like from a specific photo|

## Project domains
- Frontend - https://dzhigun.students.nomoredomains.rocks/
- Backend - https://api.dzhigun.nomoredomains.rocks/
