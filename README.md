# Video Game Review Platform
A full-stack web application that displays video game information in the form of game cards. Users can browse games, search for games, interact with game data, and most importantly, read and write reviews on their favorite video games. 

***All game data was retrieved using RAWG.io API***

## Installation & Setup

### Prerequisites
Following installations are required:
- Node.js
- npm
- MySQL

### Backend Setup
1. Navigate to the backend folder
- cd backend
2. Install dependencies
- npm install
3. If not Professor Parsons or Graders, create .env and add the following
- DB_HOST
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_NAME
- RAWG_API_KEY
4. Create tables and populate database
- npm run seed
5. Start backend server
- npm run dev
6. Server should now be running at:
- http://localhost:5001

### Frontend Setup
1. Navigate to the frontend folder
- cd frontend
2. Install dependencies
- npm install
3. Start frontend server
- npm run dev
4. App should be accessible at: 
- http://localhost:5173