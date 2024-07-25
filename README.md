# Login and Registration Project

This is a simple login and registration project built with React (frontend) and Node.js (backend). The project uses Vite for the frontend build tool and MongoDB as the database. For authentication, bcrypt is used to hash passwords and JWT tokens are used for user sessions.

## Features

- User registration
- User login
- Password hashing with bcrypt
- JWT-based authentication

## Project Structure

```
project-root/
├── client/          # Frontend (React with Vite)
└── server/          # Backend (Node.js with Express)
```

## Prerequisites

- Node.js (v14 or above)
- npm or yarn
- MongoDB

## Installation

### Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### Install dependencies

#### For the backend

```bash
cd server
npm install
```

#### For the frontend

```bash
cd ../client
npm install
```

## Configuration

### Backend

Create a `.env` file in the `server` directory and add the following:

```env

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend

If you need to configure the frontend, you can create a `.env` file in the `client` directory and add your configurations. For example:

```env
VITE_API_URL=http://localhost:5000
```

## Running the Project

### Backend

```bash
cd server
npm start
```

### Frontend

```bash
cd ../client
npm run dev
```

### Accessing the Application

Open your browser and go to `http://localhost:5173/` to access the frontend. The backend will be running on `http://localhost:8000`.

## Endpoints

### Authentication

- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - Login an existing user

## Usage

1. **Register a new user** by sending a POST request to `/api/auth/register` with `username`, `email`, and `password`.
2. **Login** with the registered user credentials by sending a POST request to `/api/auth/login`. You will receive a JWT token on successful login.
3. Use the JWT token to authenticate subsequent requests to protected endpoints.

## Technologies Used

- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: bcrypt, JWT

## License

This project is licensed under the MIT License.
