# Task 8: Advanced Server-Side Functionality

## Objective
Implement advanced server-side features for a robust backend system: custom middleware for request logging, a class-based in-memory asynchronous background job queue simulator, route-caching, and a premium **Server Operations Dashboard** featuring live log streaming.

## Features Implemented
1. **Custom Middleware Logging:** Wrote a request processing interceptor in `server.js` that tracks request start-to-finish durations, status codes, IPs, paths, and user-agents, writing entries asynchronously to `requests.log` and outputting colorized logs to the console.
2. **Asynchronous Background Task Queue:** Built a native, class-based `JobQueue` manager that buffers and processes tasks sequentially in the background. Supported jobs include:
   - **Sales Report Compilation:** Runs calculations and outputs files.
   - **Batch Email Sync:** Dispatches newsletter runs.
   - **Database Backup & Compress:** Compresses DB files using gzip.
   *Worker progress (0-100%) and individual step-by-step logs are generated and audited in real-time.*
3. **Endpoint Response Caching:** Created a cache middleware that intercepts and caches CPU-heavy JSON payloads (e.g. calculation of prime numbers at `/api/system-report`) for 15 seconds. Tracks cache Hits and Misses.
4. **Operations Control Center UI:**
   - **Live Metrics Monitor:** Real-time gauges animating CPU utilization (which spikes dynamically when a background task runs) and memory usage.
   - **Task Dispatcher:** Spawn and monitor jobs with animated progress bars.
   - **Audit Logger:** Click on any job to view its live step-by-step worker logs in a console pane.
   - **Cache Stats Panel:** Shows cache hit ratios, lists current cached keys, and contains a "Purge Cache" button.
   - **Live Log Terminal:** A green-on-black scrolling terminal window that polls `/api/logs` and streams server access logs in real-time.

## File Structure
```
task8/
├── public/
│   ├── css/
│   │   └── styles.css # Consoles, gauges, and terminal styling
│   ├── js/
│   │   └── app.js     # System monitor loops, AJAX pollers, & log streams
│   └── index.html     # Control room dashboard structure
├── package.json       # App details and scripts
├── server.js          # Custom logging, caching middleware, and JobQueue class
├── requests.log       # Output file written by the logging middleware
└── README.md          # This documentation file
```

## Setup & Running
1. **Navigate to the task8 directory**:
   ```bash
   cd task8
   ```
2. **Install packages**:
   ```bash
   npm install
   ```
3. **Boot up the server**:
   ```bash
   node server.js
   ```
   *The server runs dynamically on http://localhost:3000.*
4. Open http://localhost:3000 in your browser.
5. Search/query endpoints, trigger background operations, clear queue logs, or flush cached records to watch the live terminal logs stream.

## API Endpoints Overview
- `GET /api/logs`: Serves the last 50 entries of `requests.log` to feed the frontend console.
- `POST /api/jobs`: Places a new task (`report`, `sync`, or `backup`) in the queue.
- `GET /api/jobs`: Lists all jobs in the system with their status and progress.
- `GET /api/jobs/:id`: Fetches detailed status and step-by-step logs for a specific job.
- `POST /api/jobs/clear`: Flushes completed and failed jobs from history.
- `GET /api/cache/stats`: Fetches cache metrics (hits, misses) and cached endpoints list.
- `POST /api/cache/purge`: Clears all server-side cached responses.
- `GET /api/system-report`: Simulated CPU-heavy prime numbers search (cached for 15 seconds).

## Learning Outcomes
- **Custom Logging & File Access:** Capturing lifecycle metrics on requests and performing non-blocking file-appends.
- **Asynchronous Task Processing:** Managing queues, scheduling worker routines, tracking job states, and streaming logs without external dependencies.
- **Caching Architectures:** Optimizing backend query times by configuring headers and caching response payloads.
- **Auditing & Live Monitoring:** Designing polling feeds to mirror backend execution states visually.
