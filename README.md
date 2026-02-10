# MERN Bookstore 📚

A full-stack bookstore application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- 📖 Browse and search books by title or category
- 🛒 Shopping cart functionality
- 🔐 User authentication (JWT-based)
- 👤 Admin dashboard for managing books
- 🎨 Modern, responsive dark-themed UI

## Tech Stack

**Frontend:**
- React.js (Vite)
- React Router DOM
- Axios
- Context API for state management

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/mern-bookstore.git
   cd mern-bookstore
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the backend folder:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```

3. **Seed the Database**
   ```bash
   npm run seed
   ```

4. **Start the Backend**
   ```bash
   npm run dev
   ```

5. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   ```
   
   Create a `.env` file in the frontend folder:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

6. **Start the Frontend**
   ```bash
   npm run dev
   ```

### Default Admin Credentials

After seeding:
- **Email:** admin@bookstore.com
- **Password:** admin123

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/users/register` | Register user | Public |
| POST | `/api/users/login` | Login | Public |
| GET | `/api/users/profile` | Get profile | Protected |
| GET | `/api/books` | Get all books | Public |
| GET | `/api/books/:id` | Get book by ID | Public |
| POST | `/api/books` | Create book | Admin |
| PUT | `/api/books/:id` | Update book | Admin |
| DELETE | `/api/books/:id` | Delete book | Admin |

## Project Structure

```
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── seeder.js
└── frontend/
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        └── services/
```

## License

MIT
