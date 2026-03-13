# Academic Resource Finder

A full-stack web application built to help students discover and manage academic resources based on their courses.

## Tech Stack
* **Frontend**: React (Vite), Tailwind CSS, React Router, Lucide React
* **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Authentication

## Prerequisites
* Node.js (v16+)
* MongoDB installed locally or a free MongoDB Atlas URI

## Setup Instructions

### 1. Database Setup
Make sure MongoDB is running locally on `mongodb://127.0.0.1:27017` or update the `MONGO_URI` in `backend/.env`.

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed the database with sample data:
   ```bash
   node seed.js -i
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The background server will run on `http://localhost:5000`.*

### 3. Frontend Setup
1. Open a **new** terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend application will be available at `http://localhost:5173` (or port specified by Vite).*

## Features

- **Authentication**: JWT-based login and registration.
- **Resource Discovery**: Search and filter through diverse academic resources (Books, Lecture Videos, Research Papers).
- **Bookmarks**: Save important resources to your personalized dashboard for quick access.
- **Recommendations**: Receive personalized resource suggestions based on your designated course of study. 
- **Modern UI**: Clean, engaging, responsive glassmorphic UI powered by Tailwind CSS.

## Project Structure
```
.
├── backend
│   ├── config
│   │   └── db.js
│   ├── middleware
│   │   └── auth.js
│   ├── models
│   │   ├── Resource.js
│   │   └── User.js
│   ├── routes
│   │   ├── auth.js
│   │   └── resources.js
│   ├── .env
│   ├── package.json
│   ├── seed.js
│   └── server.js
└── frontend
    ├── public
    ├── src
    │   ├── components
    │   │   └── Navbar.jsx
    │   ├── context
    │   │   └── AuthContext.jsx
    │   ├── pages
    │   │   ├── AuthPage.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── LandingPage.jsx
    │   │   └── ResourceDiscovery.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```
