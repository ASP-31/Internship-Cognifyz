# Task 6: Database and User Authentication

## Objective
Establish a secure, persistent user authentication system using **Node.js/Express**, **MongoDB** (via Mongoose), **JSON Web Tokens (JWT)** for session management, and **bcryptjs** for credential security.

## Steps Completed
1. **Database Integration:** Configured an asynchronous connection to MongoDB using Mongoose, secured with credentials loaded dynamically via environmental variables (`.env`).
2. **User Data Modeling:** Created a `User` Mongoose schema with:
   - String validations (`trim`, `lowercase`, `unique`, and `minlength`).
   - A pre-save middleware hook to automatically salt and hash passwords using `bcryptjs` before insertion.
   - An instance verification method `comparePassword()` to safely validate passwords during login.
3. **Authentication Middleware:** Built custom verification middleware (`auth.js`) that extracts and validates JWT Bearer tokens from the `Authorization` header, injecting the verified user identity (`req.user`) into the request context.
4. **Auth Routes:** Designed modular endpoints in `routes.js`:
   - **Sign Up (`POST /api/auth/signup`)**: Validates payloads, checks if the email is registered, and stores a new user.
   - **Log In (`POST /api/auth/login`)**: Authenticates credentials, generates a signed JWT (expiring in 1 hour), and returns it to the client.
   - **Secure Dashboard (`GET /api/auth/dashboard`)**: A protected endpoint that permits access only with a valid JWT and retrieves the authenticated user's profile details (excluding the password hashes).

## File Structure
```
task6/
├── db.js              # Database connection logic using Mongoose
├── User.js            # User model, hooks (bcrypt password hashing), and methods
├── auth.js            # JWT verification middleware
├── routes.js          # Authentication endpoints (signup, login, dashboard)
├── server.js          # Main Express server entrypoint
├── .env               # Configuration variables (DB URI, JWT secret, Port)
├── package.json       # Dependency list and configuration metadata
└── README.md          # This documentation file
```

## Dependencies
- `express`: Minimalist web framework.
- `mongoose`: MongoDB object modeling tool.
- `jsonwebtoken`: JWT creation and verification.
- `bcryptjs`: Secure password hashing and salting.
- `dotenv`: Loads environment variables from `.env`.
- `express-validator`: Server-side request body validator.

## How to Run
1. **Navigate to the task6 directory**:
   ```bash
   cd task6
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure the environment**:
   Make sure you have your `.env` configured (a pre-configured MongoDB URI is already supplied in `.env` for testing):
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secure_jwt_secret_key_change_this
   ```
4. **Boot up the server**:
   ```bash
   node server.js
   ```
   *The server runs dynamically on http://localhost:3000.*

## API Endpoints & Testing

### 1. Register a User
- **Endpoint:** `POST /api/auth/signup`
- **Request Body (JSON):**
  ```json
  {
    "name": "Arjun S Pai",
    "email": "arjun@example.com",
    "password": "securepassword123"
  }
  ```
- **Example cURL:**
  ```bash
  curl -X POST http://localhost:3000/api/auth/signup \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Arjun S Pai\",\"email\":\"arjun@example.com\",\"password\":\"securepassword123\"}"
  ```

### 2. Log In
- **Endpoint:** `POST /api/auth/login`
- **Request Body (JSON):**
  ```json
  {
    "email": "arjun@example.com",
    "password": "securepassword123"
  }
  ```
- **Example cURL:**
  ```bash
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"arjun@example.com\",\"password\":\"securepassword123\"}"
  ```
- **Response:**
  ```json
  {
    "success": true,
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### 3. Access Protected Dashboard
- **Endpoint:** `GET /api/auth/dashboard`
- **Headers:** `Authorization: Bearer <your_jwt_token>`
- **Example cURL:**
  ```bash
  curl -X GET http://localhost:3000/api/auth/dashboard \
    -H "Authorization: Bearer <your_jwt_token>"
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Welcome to the secure dashboard, Arjun S Pai! Data access granted.",
    "user": {
      "_id": "64b0f...",
      "name": "Arjun S Pai",
      "email": "arjun@example.com",
      "createdAt": "2026-07-13T13:50:00.000Z",
      "__v": 0
    }
  }
  ```

## Learning Outcomes
- **Password Salting & Hashing:** Implemented one-way cryptographic functions using `bcryptjs` with auto-run middleware on database save.
- **JWT stateless auth:** Replaced traditional stateful cookie/session-based checks with stateless token verification.
- **Database Modeling:** Used Mongoose validations and lifecycle hooks to govern how data enters MongoDB.
- **Payload Validation:** Handled input sanitization and verification using `express-validator` to prevent corrupt requests.
