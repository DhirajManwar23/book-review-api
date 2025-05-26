Book Review API

A RESTful API built using Node.js, Express.js, MongoDB, and JWT for user authentication.

Features

Authentication

POST /api/auth/register: Register a new user

POST /api/auth/login: Login and get JWT token

Book Endpoints

POST /api/books: Add a new book (Authenticated)

GET /api/books: Get all books (Supports pagination, filtering by author and genre)

GET /api/books/:id: Get book details (Includes average rating and paginated reviews)

Review Endpoints

POST /api/books/:bookId/reviews: Submit a review (One per user per book)

PUT /api/reviews/:id: Update your own review

DELETE /api/reviews/:id: Delete your own review

Search

GET /api/search?q=: Search by title or author (case-insensitive, partial match)

Setup Instructions

Clone the Repository

git clone https://github.com/DhirajManwar23/book-review-api
cd book-review-api

Install Dependencies

npm install

Environment Variables
Create a .env file in the root directory:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

Run the Server

Example API Requests

Register

curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"username": "john", "password": "123456"}'

Login

curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"username": "john", "password": "123456"}'

Add Book (Authenticated)

curl -X POST http://localhost:5000/api/books \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{"title": "Atomic Habits", "author": "James Clear", "genre": "Self-help"}'

Search Books

curl http://localhost:5000/api/search?q=atomic



ER Diagram:
+------------+     +---------+      +----------+
|   User     | 1---|  Review | ---1 |   Book   |
+------------+     +---------+      +----------+
| _id        |     | _id     |      | _id      |
| username   |     | rating  |      | title    |
| password   |     | comment |      | author   |
+------------+     | book    |      | genre    |
                   | user    |      | reviews  |
                   +---------+      +----------+




If you want to check all apis in postman just  import this file BookReviewAPI_Complete.postman_collection.json
follow steps
Get the Postman Collection file -: BookReviewAPI_Complete.postman_collection.json

Open Postman and click Import (top-left corner).
Select the downloaded JSON file.
Once imported, you'll see a folder named BookReviewAPI containing all available API requests:
User Signup & Login
Add/Get Books (with pagination and filters)
Get Book Details (with average rating and reviews)
Submit, Update, and Delete Reviews
Search by Title or Author
