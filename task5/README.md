# Task 5: API Integration and Front-End Interaction

## Objective
Establish database-like interaction using a Node.js REST API and consume it asynchronously via client-side Fetch operations.

## Steps Completed
1. Formulated a RESTful backend API using Express to support CRUD (Create, Read, Update, Delete) tasks on an in-memory data store.
2. Built a dynamic frontend console using HTML and CSS for task and dashboard management.
3. Integrated the Fetch API with `async/await` syntax to synchronize frontend views with backend database state.
4. Created operations to:
   - **Create:** Add items to tracker list.
   - **Read:** Fetch and list items upon dashboard loading.
   - **Update:** Toggle completion status of individual items.
   - **Delete:** Remove items permanently from state.

## File Structure
```
task5/
├── server.js          # RESTful Express API (GET, POST, PUT, DELETE)
├── package.json       # npm scripts and configurations
├── index.html         # Frontend dashboard consuming the API endpoints
└── README.md          # This file
```

## How to Run
1. Navigate to the `task5` directory:
   ```bash
   cd task5
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```
3. Boot up the backend API server:
   ```bash
   npm start
   ```
   *The server runs on http://localhost:3000.*
4. Open `index.html` in your web browser (or serve it through a web server).
5. Add items, toggle progress statuses, or delete them to observe full asynchronous synchronization.

## API Endpoints
- `GET /api/items` - Fetches the array of tracking items.
- `POST /api/items` - Creates a new item. Expects JSON `{ name: "..." }`.
- `PUT /api/items/:id` - Updates/toggles properties on a specific item by ID.
- `DELETE /api/items/:id` - Removes the specified item from in-memory array.

## Learning Outcomes
- Structuring modular RESTful endpoints in Node.js/Express.
- Enabling Cross-Origin Resource Sharing (CORS) using express middleware.
- Writing reliable asynchronous JavaScript using modern `async/await` syntax.
- Rendering dynamic database-driven UI feeds dynamically using JavaScript.
