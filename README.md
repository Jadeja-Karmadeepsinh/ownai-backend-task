# Backend Assessment – User Management API

This project is a **Node.js + Express backend** implementing authentication, role-based access control, and user management APIs using **SQLite** with **TypeORM**.  
It is designed to meet typical backend assessment requirements with clean architecture, validation, and testing.

---

## 🧠 Tech Stack

- **Node.js**
- **Express.js**
- **SQLite** (file-based database)
- **TypeORM**
- **JWT (jsonwebtoken)** for authentication
- **bcryptjs** for password hashing
- **express-validator** for request validation

---

## 📁 Project Structure

```text
Backend/
├── src/
│   ├── routes/
│   │   ├── auth.js            # Auth routes (login/register)
│   │   └── users.js           # User APIs
│   ├── entities/
│   │   └── User.js            # User entity
│   ├── validators/
│   │   └── authValidators.js  # Request validation logic
│   ├── middleware/
│   │   └── auth.js  # Authentication middleware
│   │   └── roles.js
│   ├── data-source.js         # TypeORM configuration
│   ├── app.js                 # Express app setup
│   └── server.js              # Server entry point
├── data/
│   └── app.sqlite             # SQLite database file (auto-created)
├── test/
│   └── auth-and-users.test.js            # Integration tests
├── .env.example               # Environment variable template
├── package.json
└── README.md
```

## ⚙️ Environment Setup

`.env.example` may be ignored by environment rules, so **create `.env` manually** in the project root.

### `.env`
```env
PORT=3000
JWT_SECRET=your_jwt_secret_here_change_me
DB_PATH=./data/app.sqlite
```

### How to Run Locally
Install dependencies

```bash
npm install
```

### Note:
While installing dependencies, **`morgan` might not get installed**. This is expected it’s my code, so yes, I know 😅
so install it manully in your root folder

```bash
npm install morgan
```

### Run database migrations

Creates the SQLite database and tables.

```bash
npm run migration:run
```

### This generates:

data/app.sqlite

### Start the server

Development

```bash
npm run dev
```

Production

```bash
npm start
```

### Server will run at:

`http://localhost:3000`

## API Endpoints

### Authentication

#### Register User
**POST** `/api/auth/register`

```json
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "password123",
  "role": "admin",
  "phone": "9999999999",
  "city": "Ahmedabad",
  "country": "India"
}
```

**Response:** `201 Created`

---

#### Login
**POST** `/api/auth/login`

```json
{
  "email": "admin@test.com",
  "password": "password123"
}
```

**Response:** Returns a JWT token.

---

### 👤 Users

#### List Users (Admin only)
**GET** `/api/users`

**Supports filters:**
- `?search=name_or_email`
- `?country=India`

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
```

---

#### Get User by ID
**GET** `/api/users/:id`

**Access rules:**
- **Admin** → Can access any user
- **Staff** → Can access only their own record

---

## 🧪 Running Tests

```bash
npm test
```

**Includes:**
- Authentication flow tests
- Protected route tests
- Validation checks

---

## 🗄 Database (SQLite)

- Database is stored as a single file:
  ```
  data/app.sqlite
  ```
- No database server required
- Managed via **TypeORM migrations**
- Can be viewed using:
  - SQLiteStudio
  - VS Code SQLite extensions
