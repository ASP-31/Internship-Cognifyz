# Task 2: Inline Styles, Basic Interaction, and Server-Side Validation

## Objective
Expand inline styles and introduce server-side validation for form submissions.

## Steps Completed
1. Extended HTML with more complex forms (name, email, password, age) and user interactions.
2. Utilized inline JavaScript for client-side form validation.
3. Implemented server-side validation for submitted form data.
4. Stored validated data in temporary server-side storage (in-memory array).
5. Used server-side rendering (EJS) to dynamically display form and submission results.

## Project Structure
```
task2/
├── server.js          # Main Express server with routes and logic
├── package.json       # npm metadata and dependencies
├── views/
│   ├── index.ejs      # Registration form with client-side validation
│   └── submission.ejs # Page showing all submitted records (passwords masked)
├── public/            # Static assets (CSS, images, etc.)
└── README.md          # This file
```

## How to Run
1. Navigate to the `task2` directory:
   ```bash
   cd task2
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   or
   ```bash
   node server.js
   ```
4. Open your browser and go to `http://localhost:3000`.
5. Fill out the registration form and submit.
6. After successful submission, you'll be redirected to `/submissions` page showing all stored records.
7. You can go back to the form to add more entries.

## Dependencies
- express: ^5.2.1
- ejs: ^6.0.1

## Features Implemented
### Frontend
- Inline CSS for styling.
- Client-side validation using JavaScript (validates name, email, password length, age range).
- Inline error messages displayed next to fields.

### Backend
- Express server with body parsing middleware.
- In-memory array (`submissions`) to store form data temporarily.
- Server-side validation mirroring client-side checks.
- Routes:
  - `GET /` - renders the form.
  - `POST /submit` - processes form data, validates, stores, redirects.
  - `GET /submissions` - displays all submissions.

## Validation Rules
- **Name**: Required.
- **Email**: Must match email pattern.
- **Password**: Minimum 6 characters.
- **Age**: Must be a number between 18 and 100.

## Learning Outcomes
- Implementing client-side validation with JavaScript.
- Performing server-side validation and sanitization.
- Storing data temporarily on the server (in-memory).
- Using EJS for server-side rendering and passing data to views.
- Understanding request handling (GET, POST) and redirection.
- Using Express middleware for body parsing and static files.

## Next Steps
- **Task 3** introduces advanced CSS styling and responsive design using frameworks like Bootstrap.
- Consider enhancing this task by adding password confirmation, email uniqueness, or connecting to a database.
