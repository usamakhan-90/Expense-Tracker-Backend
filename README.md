# 💸 Expense Tracker Backend

A robust and secure backend API for an Expense Tracker Application built with Node.js, Express, MongoDB, and Cloudinary. This backend supports user authentication, income and expense management, financial summaries, and data export to Excel.

---

## 🔐 Authentication & Authorization

- **JWT Authentication** (Stored in HTTP-only cookies)
- **Protected Routes** – Only authenticated users can access and modify their data
- **User Roles:** Currently single role (user), easily extendable

---

## 👤 User Features

- Register with:
  - Full Name
  - Email
  - Password (securely hashed)
  - Profile Picture (stored via Cloudinary)
- Login with secure cookie-based authentication
- Update account details (name, email, profile picture, password)
- Logout functionality

---

## 💰 Income Module

- Create, Read, Update, Delete Income Entries
- Download all income data as an `.xlsx` Excel file
- Each entry includes:
  - icon
  - source
  - Amount
  - Date

## 💸 Expense Module

- Create, Read, Update, Delete Expense Entries
- Download all expense data as an `.xlsx` Excel file
- Each entry includes:
  - icon
  - Amount
  - Category
  - Date

## 📊 Summary Dashboard
- Total Balance
- Total Income
- Total Expenses
- Last 30 Days Expenses
- Last 60 Days Income
- Last Transcations
- Easily extendable with monthly trends and graphs

---

## ☁️ Cloudinary Integration

- Upload and manage user profile pictures
- Auto-delete or update existing images on changes


## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JWT + Cookies
- **File Uploads:** Multer + Cloudinary
- **Export Data:** ExcelJS
- **Others:** dotenv, bcrypt, cors, cookie-parser

---

## 🚀 Getting Started

1. Clone the repo:
   - git [clone https://github.com/your-username/expense-tracker-backend.git](https://github.com/usamakhan-90/Expense-Tracker-Backend)
2. 📦 Install Dependencies
  - npm i
3. 🛠️ Environment Setup
Create a .env file in the root of the project and add the following:
 - PORT = port

- MONGO_URL = mongo url

- CLOUDINARY_NAME = cloudinary-name

- CLOUDINARY_API_KEY = cloudinary-api-key

- CLOUDINARY_SECRET = cloudinary-secret-key

- SECRET_KEY = Secret key

4. 🚀 Start the Development Server
- npm run dev

5. 🔮 Future Improvements
- 📊 Monthly analytics & charts

- 🔔 Budget limits and notifications

- 👥 Multi-user role support (e.g. Admin)

- 🔎 Pagination & search filters

- 🌐 Multi-language support


