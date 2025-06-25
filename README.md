
<div >

# 📚 Bookshelf Backend API  
_Your personal reading tracker & book review manager_

Built with **Node.js**, **Express**, **MongoDB**, and **Firebase Authentication**

</div>

---

## 🔗 Live Project Links

- 🌐 **Client Live Site**: [emons-bookshelf.netlify.app](https://emons-bookshelf.netlify.app)
- 💻 **Client Repository**: [Bookshelf Client](https://github.com/K-emon22/Bookshelf-Client)

---

## 🧾 Project Description

Bookshelf is a full-stack web application for book lovers. This backend server handles user authentication, book and review management, reading status updates, and upvoting functionality. It ensures secure access through Firebase and JWT, enabling users to manage and track their reading activities seamlessly.

---

## 🚀 Features

### 🔐 Authentication
- Firebase Authentication (Google, Email/Password)
- JWT-based route protection

### 📚 Book Management
- Add, update, delete books
- Filter books by user
- Sort books by upvotes

### 💬 Reviews
- One review per book per user
- Edit and delete your own reviews

### 📈 Reading Progress
- Track reading status (`Want-to-Read`, `Reading`, `Read`)
- Update book status with PATCH requests

### ⬆️ Upvote System
- Upvote others' books (self-upvotes restricted on client)
- Sorted "Popular Books" section based on upvotes

---

## ⚙️ Tech Stack

### 🧩 Backend
- **Node.js**
- **Express.js**
- **MongoDB Atlas**
- **Firebase Admin SDK**
- **JWT**
- **dotenv**, **CORS**

---

## 📁 Folder Structure

📦 Bookshelf-Server
├── jot.json             # Firebase service account
├── .env                 # Environment variables
├── index.js             # Main server logic
├── package.json

---

## 🔧 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/K-emon22/Bookshelf-Server.git
cd Bookshelf-Server

2. Install dependencies

npm install

3. Add environment variables

Create a .env file in the root with:

PORT=3000
MONGODB_URI=your_mongodb_connection_string

Place your Firebase service account JSON in the root as:

jot.json

4. Start the server

node index.js

Server will be running on:

http://localhost:3000

⸻

📡 API Endpoints

🔓 Public Routes

Method	Endpoint	Description
GET	/	Server status check
GET	/allBooks	Retrieve all books
GET	/bookDetails/:id	Retrieve a specific book
GET	/sorted	Get top 6 upvoted books
GET	/review	Retrieve all reviews

🔒 Protected Routes (JWT Required)

Method	Endpoint	Description
POST	/allBooks	Add a new book
PUT	/allBooks/:id	Update a book
DELETE	/allBooks/:id	Delete a book
GET	/userBook	Get books added by user
GET	/alldata	Get all books (token validated)
PATCH	/bookDetails/:id	Update reading status
PATCH	/upvote/:id	Upvote a book

🗨️ Review Management

Method	Endpoint	Description
POST	/review	Add a review
PUT	/review/:id	Edit a review
DELETE	/review/:id	Delete a review


⸻

🔐 Authentication Flow
	1.	User logs in via Firebase (Google/Email)
	2.	Frontend retrieves Firebase ID token
	3.	Backend verifies it using firebase-admin
	4.	JWT routes check if decoded email matches query email

⸻

📌 Example Book Document

{
  "title": "Atomic Habits",
  "author": "James Clear",
  "category": "Self-help",
  "reading_status": "Reading",
  "upvote": 0,
  "user": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}


⸻

🧑‍💻 Author

Md Emon Sheikh
📧 emon.web.dev@gmail.com
🌍 Bangladesh

⸻

💬 Feedback or Contributions?

Feel free to open issues or fork and contribute via pull requests.

⸻

