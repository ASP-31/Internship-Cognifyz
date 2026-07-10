const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Task 3: Responsive Layout Demo' });
});

app.get('/dashboard', (req, res) => {
  // Sample data for dashboard
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Tester', status: 'Active' }
  ];
  
  res.render('dashboard', { 
    title: 'Dashboard - Responsive Layout', 
    users: users 
  });
});

app.get('/forms', (req, res) => {
  res.render('forms', { title: 'Responsive Forms' });
});

app.post('/submit-form', (req, res) => {
  // Process form data (in a real app, this would go to a database)
  console.log('Form submitted:', req.body);
  res.redirect('/forms?success=true');
});

app.post('/submit-contact', (req, res) => {
  // Process contact form data
  console.log('Contact form submitted:', req.body);
  res.redirect('/forms?success=true');
});

app.post('/signup', (req, res) => {
  // Process signup form data
  console.log('Signup form submitted:', req.body);
  res.redirect('/forms?success=true');
});

// Error handling
app.use((req, res) => {
  res.status(404).render('error', { 
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Server Error',
    message: 'Something went wrong!'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
