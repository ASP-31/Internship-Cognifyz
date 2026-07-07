const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// In-memory storage for submissions (temporary server-side storage)
let submissions = [];

// Routes
app.get('/', (req, res) => {
    res.render('index', { submittedData: null, errors: null });
});

app.post('/submit', (req, res) => {
    const { name, email, password, age } = req.body;
    let errors = {};

    // Server-side validation
    if (!name || name.trim() === '') {
        errors.name = 'Name is required';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[\s@]+$/;
    if (!emailPattern.test(email)) {
        errors.email = 'Valid email is required';
    }
    if (!password || password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
        errors.age = 'Age must be a number between 18 and 100';
    }

    if (Object.keys(errors).length > 0) {
        // If errors, re-render form with errors and submitted data
        return res.render('index', {
            submittedData: { name, email, password, age },
            errors
        });
    }

    // Store submission
    submissions.push({ name, email, password, age });

    // Redirect to submission page
    res.redirect('/submissions');
});

app.get('/submissions', (req, res) => {
    res.render('submission', { submissions });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;