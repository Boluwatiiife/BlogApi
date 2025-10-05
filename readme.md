# 📝 Blogging API

A RESTful **Blogging API** built with Node.js, Express, MongoDB, and JWT authentication.
This API allows users to sign up, log in, create, manage, and publish blogs.
Both authenticated and unauthenticated users can view published blogs, while blog owners can create, edit, publish, delete, and manage their blogs.

## 🚀 Features

### 👤 User Management

- User can sign up with:
- First name
- Last name
- Unique email
- Password (securely hashed)
- User can log in with email and password.
- JWT-based authentication (expires after 1 hour).

## 📚 Blog Management

### Blogs have the following fields:

- title (unique, required)
- description
- author
- state (draft or published)
- read_count (increments each time it’s read)
- reading_time (calculated using blog body length)
- tags
- body (required)
- timestamp (date created)

### Unauthenticated & Authenticated users:

- Can view published blogs (paginated).
- Can search blogs by author, title, tags.
- Can order blogs by read_count, reading_time, timestamp.
- Can view a single published blog (read_count increases by 1).

### Authenticated users:

- Can create a blog (defaults to draft state).
- Can update their blogs (draft or published).
- Can publish a blog (change state from draft → published).
- Can delete their blogs (draft or published).
- Can view only their blogs, filterable by state.

## 🛠️ Tech Stack

- Node.js + Express → Backend framework
- MongoDB (Mongoose ODM) → Database
- JWT (JSON Web Token) → Authentication
- bcrypt → Password hashing
- dotenv → Environment variable management
- Jest / Supertest → Testing

### 📂 Project Structure

```text
blogging-api/
│── src/
│ ├── config/
│ │ └── db.js # MongoDB connection
│ ├── controllers/
│ │ ├── authController.js
│ │ └── blogController.js
│ ├── middleware/
│ │ ├── authMiddleware.js # JWT verification
│ │ └── errorHandler.js
│ ├── models/
│ │ ├── User.js
│ │ └── Blog.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ └── blogRoutes.js
│ ├── utils/
│ │ └── calculateReadingTime.js
│ ├── app.js
│ └── server.js
│
│── tests/
│── .env
│── .gitignore
│── package.json
│── README.md
```

### ⚙️ Installation & Setup

- Clone the repository

- git clone https://github.com/your-username/blogging-api.git
- cd blogging-api

- Install dependencies

- npm install

#### Create .env file

PORT=5000
MONGO_URI=mongodb://localhost:27017/blogging_api
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1h

- Run the server
- npm run dev
- Run tests
- npm test

## 🔑 API Endpoints

### 🔐 Authentication

- POST /api/auth/signup => Register a new user
- POST /api/auth/login => Login user and get JWT

### 📖 Blogs

- GET /api/blogs => Get all published blogs (paginated, searchable, orderable) // _authorization not required_
- GET /api/blogs/:id => Get a single published blog (increments read*count) \_authorization not required*
- POST /api/blogs => Create a new blog (defaults to draft)
  _authorization required_
- PATCH /api/blogs/:id => Update blog (only owner)
  _authorization required_
- PATCH /api/blogs/:id/ => publish Publish a draft blog
  _authorization required_
- DELETE /api/blogs/:id => Delete blog (only owner)
  _authorization required_
- GET /api/users/:id/blogs => Get blogs created by a user (filter by state)
  _authorization required_
  📑 Pagination, Search & Filtering

##### Pagination → Default = 20 blogs per page. Use query params:

- GET /api/blogs?page=2&limit=10

##### Search → by author, title, or tags:

- GET /api/blogs?search=tech

##### Order → by read_count, reading_time, timestamp:

- GET /api/blogs?order_by=read_count

### 🧮 Reading Time Algorithm

**The reading_time is calculated by:**

words = total words in blog body
average_reading_speed = 200 words per minute
reading_time = Math.ceil(words / 200)

### ✅ Testing

**Tests written using Jest & Supertest.**
**Covers:**

- User signup & login
- Authentication with JWT
- Blog CRUD operations
- Pagination, filtering & ordering

**Run tests:**

- npm test

## ✨ Future Improvements

- Add role-based access control (admin, user).
- Enable image uploads for blogs.
- Add comments & likes feature.
