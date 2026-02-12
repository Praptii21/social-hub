# Social-hub 🚀  
A Full-Stack Social Media Platform built using FastAPI and React.

## 📌 Overview
Connectify is a full-stack social media web application that allows users to:

- 🔐 Register & Login securely (JWT Authentication)
- 👤 Create and manage profiles
- 📝 Create posts
- ❤️ Like and unlike posts
- 💬 Comment on posts
- 👥 Follow / Unfollow users
- 📰 View a personalized feed
- 🔗 Visit other user profiles

This project demonstrates real-world backend architecture, authentication, relational database design, and frontend state management.

## 🏗️ Tech Stack

### 🔹 Frontend
- React.js
- React Router
- Axios
- Context API (Auth State Management)
- Bootstrap / Custom CSS

### 🔹 Backend
- FastAPI
- SQLAlchemy (ORM)
- Pydantic (Schemas)
- JWT Authentication
- Dependency Injection

### 🔹 Database
- PostgreSQL
- Relational Database Design

## 🧠 Core Features Explained

### 🔐 Authentication System
- Secure password hashing
- JWT-based login system
- Protected routes using React PrivateRoute
- Token validation on backend

### 👤 User System
- User registration & login
- Profile pages
- Dynamic routing (`/user/:id`)
- Followers & following count


### 📝 Post System
- Create posts
- Fetch all posts for feed
- Fetch posts by specific user
- Display timestamps


### ❤️ Like System
- Many-to-many relationship (users ↔ posts)
- Toggle like/unlike logic
- Real-time like count update


### 💬 Comment System
- Users can comment on posts
- Linked via foreign keys
- Comments rendered dynamically under posts


### 👥 Follow System
- Self-referencing many-to-many relationship
- Follow/unfollow users
- Followers & following tracking
- Personalized feed based on following

