# Lost & Found Item Management System - MERN Stack

A complete Lost & Found management system built with MongoDB, Express, React, and Node.js that allows users to register, login, report lost/found items, and manage their entries.

## 🌐 Live Demo

- **Frontend:** https://ai-fsd-mse-2-three.vercel.app
- **Backend API:** https://ai-fsd-mse2-3w6g.onrender.com

## 🎯 Features

### Part A: Backend (6 Marks)
- ✅ MongoDB schema with User (Name, Email, Password) and Item (ItemName, Description, Type, Location, Date, ContactInfo)
- ✅ REST APIs:
  - `POST /api/register` - Register new user
  - `POST /api/login` - Authenticate and return JWT token
  - `POST /api/items` - Add new item
  - `GET /api/items` - View all items
  - `GET /api/items/:id` - View item by ID
  - `PUT /api/items/:id` - Update item
  - `DELETE /api/items/:id` - Delete item
  - `GET /api/items/search/query?name=xyz` - Search items
- ✅ bcrypt for password hashing
- ✅ JWT for authentication

### Part B: Frontend (6 Marks)
- ✅ Registration Form (Name, Email, Password)
- ✅ Login Form (Email, Password)
- ✅ Dashboard with:
  - Add item form
  - Display all items
  - Search items
  - Update/Delete items (own items only)
  - Logout button
- ✅ Axios for API integration
- ✅ JWT token stored in localStorage
- ✅ Automatic redirect to Dashboard on login

### Part C: Integration & Functionality (3 Marks)
- ✅ Protected /dashboard route with authentication middleware
- ✅ Only logged-in users can view dashboard and manage items
- ✅ Error handling:
  - Invalid login credentials
  - Duplicate email registration
  - Unauthorized access
- ✅ Logout functionality (clears token & redirects)
- ✅ Bootstrap styling with custom CSS

## 📁 Project Structure

```
student-auth-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   └── Student.js            # Student schema
│   ├── routes/
│   │   └── auth.js               # API routes
│   ├── .env                      # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js                 # Express server
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Register.jsx      # Registration form
│   │   │   ├── Login.jsx         # Login form
│   │   │   └── Dashboard.jsx     # Protected dashboard
│   │   ├── utils/
│   │   │   └── api.js            # Axios configuration
│   │   ├── App.jsx               # Main app with routing
│   │   ├── App.css               # Styling
│   │   ├── main.jsx              # Entry point
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Step 1: MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit the .env file and add your MongoDB connection string:
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/studentDB?retryWrites=true&w=majority
# JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
# PORT=5000

# Start the backend server
npm start

# For development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Frontend (.env) - Optional
```env
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Public Routes
- `POST /api/register` - Register a new student
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "course": "Computer Science"
  }
  ```

- `POST /api/login` - Login
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Protected Routes (Require JWT Token)
- `GET /api/profile` - Get student profile
- `PUT /api/update-password` - Update password
  ```json
  {
    "oldPassword": "password123",
    "newPassword": "newpassword123"
  }
  ```

- `PUT /api/update-course` - Update course
  ```json
  {
    "course": "Data Science"
  }
  ```

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend validates credentials
3. Backend generates JWT token
4. Token sent to frontend
5. Frontend stores token in localStorage
6. Token included in Authorization header for protected routes
7. Backend middleware verifies token
8. Access granted/denied based on token validity

## 🎨 Features Implemented

### Security
- ✅ Password hashing with bcrypt (salt rounds: 10)
- ✅ JWT token authentication
- ✅ Protected routes with middleware
- ✅ Token expiration (7 days)
- ✅ Input validation
- ✅ Error handling

### User Experience
- ✅ Responsive design with Bootstrap
- ✅ Loading states
- ✅ Error messages
- ✅ Success notifications
- ✅ Form validation
- ✅ Automatic redirects
- ✅ Clean and modern UI


## 🛠️ Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- bcrypt
- jsonwebtoken
- cors
- dotenv

### Frontend
- React 18
- React Router DOM
- Axios
- Bootstrap 5
- Vite

## 📚 Learning Outcomes

This project demonstrates:
- Full-stack MERN development
- RESTful API design
- JWT authentication
- Password hashing and security
- Protected routes
- State management in React
- Form handling and validation
- Error handling
- Responsive UI design
- Deployment to cloud platforms

