# Task 1: HTML Structure and Basic Server Interaction

## Objective
Introduce the concept of server-side rendering and basic form submissions.

## Steps Completed
1. Created an HTML structure with a form for user input (name and email).
2. Set up a simple Node.js server using Express.
3. Created server-side endpoints to handle form submissions (GET `/` and POST `/submit`).
4. Used server-side rendering (EJS) to dynamically generate HTML pages:
   - `index.ejs`: Displays the form.
   - `submission.ejs`: Shows submitted data.

## File Structure
```
task1/
├── server.js          # Main server file
├── package.json       # npm dependencies and scripts
├── views/
│   ├── index.ejs      # Form page
│   └── submission.ejs # Submission confirmation page
├── public/            # Static assets (CSS, images, etc.)
└── README.md          # This file
```

## How to Run
1. Navigate to the `task1` directory.
2. Install dependencies (if not already installed):
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
   or
   ```
   node server.js
   ```
4. Open your browser and go to `http://localhost:3000`.
5. Fill out the form and submit to see the submitted data displayed.

## Dependencies
- express: ^5.2.1
- ejs: ^6.0.1

## Notes
- The server uses `express.urlencoded()` middleware to parse form data.
- Static assets are served from the `public` directory.
- The form uses POST method to submit data to `/submit`.
- After submission, the user is shown a thank-you page with their submitted name and email.

## Learning Outcomes Achievements
- Demonstrated setting up an Express server.
- Implemented server-side rendering with EJS.
- Handled GET and POST routes.
- Created a simple form with validation (HTML5 required attribute).