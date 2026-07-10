# Task 3: Advanced CSS and Responsive Design

## Objective
Implement complex layouts using CSS variables, Flexbox, and CSS Grid, adhering to mobile-first responsive design principles.

## Steps Completed
1. Created responsive layout for multiple pages (Home, Dashboard, Forms).
2. Utilized Flexbox for the navigation header, layout wrapping, and form field grouping.
3. Mastered CSS Grid for two-dimensional dashboard metrics cards and multi-column forms.
4. Practiced Mobile-First CSS design using media queries (`@media (min-width: 576px)`, `@media (min-width: 768px)`, etc.).
5. Rendered dynamic EJS templates for structured data tables and form results on the server-side.

## File Structure
```
task3/
├── server.js          # Main Express server with routes
├── package.json       # npm dependencies and start scripts
├── views/
│   ├── index.ejs      # Landing showcase page
│   ├── dashboard.ejs  # User management dashboard with CSS Grid
│   ├── forms.ejs      # Responsive input forms showcase
│   └── error.ejs      # Custom error fallback pages
├── public/
│   └── css/
│       └── styles.css # Main design system stylesheets
└── README.md          # This file
```

## How to Run
1. Navigate to the `task3` directory:
   ```bash
   cd task3
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```
4. Access in your browser: `http://localhost:3000`

## Dependencies
- express: ^5.2.1
- ejs: ^6.0.1

## Features Implemented
### Layout and Responsiveness
- **Design Tokens:** Defined CSS Custom Properties (`:root`) for colors, shadows, borders, transitions, and breakpoints.
- **Flexbox Navigation:** Flex alignment for the navigation bar, scaling down dynamically.
- **CSS Grid Cards:** Dashboard cards for user statistics that resize/reflow automatically.
- **Media Queries:** Clean overrides starting from mobile view and scaling up to tablets and desktops.
- **Custom Error Route:** Renders standard 404/500 screens styled matching the design system.

## Learning Outcomes
- Designing UI from mobile view upward.
- Deepening understanding of the difference between CSS Grid (2D) and Flexbox (1D).
- Managing clean, global variables in CSS.
- Serving assets and view directories cleanly across standard EJS templates.
