// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const LOG_FILE = path.join(__dirname, 'requests.log');

// Support JSON & urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Custom Logging Middleware
app.use((req, res, next) => {
  const start = process.hrtime();
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const method = req.method;
  const url = req.url;
  const userAgent = req.headers['user-agent'] || 'Unknown Agent';

  // Intercept response finish
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationMs = Math.round((diff[0] * 1e9 + diff[1]) / 1e6);
    const status = res.statusCode;

    // Log line format
    const logLine = `[${timestamp}] ${ip} -- "${method} ${url}" Status: ${status} -- ${durationMs}ms -- "${userAgent}"\n`;

    // Append to file
    fs.appendFile(LOG_FILE, logLine, (err) => {
      if (err) console.error('❌ Failed to write to requests.log:', err.message);
    });

    // Console logging
    let statusColor = '\x1b[32m'; // Green
    if (status >= 400) statusColor = '\x1b[31m'; // Red
    else if (status >= 300) statusColor = '\x1b[33m'; // Yellow
    
    console.log(`📊 ${statusColor}[${status}]\x1b[0m ${method} ${url} - \x1b[36m${durationMs}ms\x1b[0m`);
  });

  next();
});

// Serve frontend assets
app.use(express.static('public'));

// 2. Response Caching Engine
const cacheStore = new Map();
let cacheHits = 0;
let cacheMisses = 0;

// Caching middleware
const cacheMiddleware = (durationSec) => {
  return (req, res, next) => {
    const key = req.originalUrl || req.url;
    const now = Date.now();

    if (cacheStore.has(key)) {
      const cached = cacheStore.get(key);
      if (now < cached.expiresAt) {
        cacheHits++;
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('Content-Type', 'application/json');
        return res.send(cached.body);
      } else {
        cacheStore.delete(key);
      }
    }

    cacheMisses++;
    res.setHeader('X-Cache', 'MISS');
    // Intercept res.send to save response
    const originalSend = res.send;
    res.send = function (body) {
      cacheStore.set(key, {
        body: body,
        expiresAt: Date.now() + (durationSec * 1000)
      });
      originalSend.call(this, body);
    };
    next();
  };
};

// 3. Asynchronous Job Queue Manager
class JobQueue {
  constructor() {
    this.jobs = [];
    this.isWorking = false;
    this.activeJobId = null;
  }

  createJob(type) {
    const jobNames = {
      report: 'Sales Report Compilation',
      sync: 'Batch Email Synchronization',
      backup: 'System Database Backup & Compression'
    };

    const newJob = {
      id: 'job_' + Math.random().toString(36).substring(2, 10),
      type: type,
      name: jobNames[type] || 'Background Task',
      status: 'pending',
      progress: 0,
      logs: [`[${new Date().toLocaleTimeString()}] Job queued as pending.`],
      createdAt: new Date(),
      startedAt: null,
      completedAt: null,
      error: null
    };

    this.jobs.push(newJob);
    this.processNext();
    return newJob;
  }

  async processNext() {
    if (this.isWorking) return;
    const nextJob = this.jobs.find(j => j.status === 'pending');
    if (!nextJob) {
      this.isWorking = false;
      this.activeJobId = null;
      return;
    }

    this.isWorking = true;
    this.activeJobId = nextJob.id;
    nextJob.status = 'processing';
    nextJob.startedAt = new Date();
    nextJob.logs.push(`[${new Date().toLocaleTimeString()}] Worker picked up job. Initializing processing...`);

    // Start simulated task execution
    this.executeSimulatedTask(nextJob);
  }

  executeSimulatedTask(job) {
    const steps = {
      report: [
        { progress: 20, log: 'Connecting to main transactional DB replication instances...' },
        { progress: 40, log: 'Compiling sales spreadsheets and computing quarterly returns...' },
        { progress: 60, log: 'Generating HTML graphs and embedding base64 metrics...' },
        { progress: 80, log: 'Writing PDF streams to workspace storage...' },
        { progress: 100, log: 'Sales Report compiled successfully!' }
      ],
      sync: [
        { progress: 15, log: 'Loading contact logs and resolving verification scopes...' },
        { progress: 35, log: 'Dispatching batch 1 (Arjun, Sarah, Mark)...' },
        { progress: 60, log: 'Dispatching batch 2 (Elena, Chloe, John)...' },
        { progress: 85, log: 'Registering delivery notifications and callback hooks...' },
        { progress: 100, log: 'Email Synchronization finished. All newsletters sent.' }
      ],
      backup: [
        { progress: 25, log: 'Locking tables and spawning pg_dump worker threads...' },
        { progress: 50, log: 'Writing database binaries to backup target directories...' },
        { progress: 75, log: 'Compressing archive using gzip (high compression ratio)...' },
        { progress: 100, log: 'Archive verification complete. Backup completed.' }
      ]
    };

    const taskSteps = steps[job.type] || [
      { progress: 50, log: 'Executing task...' },
      { progress: 100, log: 'Task completed successfully.' }
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep >= taskSteps.length) {
        clearInterval(interval);
        job.status = 'completed';
        job.completedAt = new Date();
        job.logs.push(`[${new Date().toLocaleTimeString()}] Job finished successfully.`);
        this.isWorking = false;
        this.activeJobId = null;
        this.processNext(); // Process next job
        return;
      }

      const step = taskSteps[currentStep];
      job.progress = step.progress;
      job.logs.push(`[${new Date().toLocaleTimeString()}] ${step.log}`);
      currentStep++;
    }, 700); // Advance steps every 700ms
  }

  getJobs() {
    return this.jobs.map(j => ({
      id: j.id,
      name: j.name,
      status: j.status,
      progress: j.progress,
      createdAt: j.createdAt,
      startedAt: j.startedAt,
      completedAt: j.completedAt
    }));
  }

  getJobDetails(id) {
    return this.jobs.find(j => j.id === id);
  }

  clearQueue() {
    // Keep only active/pending jobs
    this.jobs = this.jobs.filter(j => j.status === 'processing' || j.status === 'pending');
  }
}

const queue = new JobQueue();

// 4. API Routes

// @route   GET /api/logs
// @desc    Retrieve the last 50 lines of requests.log
app.get('/api/logs', (req, res) => {
  if (!fs.existsSync(LOG_FILE)) {
    return res.json({ success: true, logs: ['No logs generated yet. Visit endpoints to log requests.'] });
  }

  fs.readFile(LOG_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to read logs.' });
    }
    const lines = data.trim().split('\n');
    const last50 = lines.slice(-50).reverse(); // Newest first
    res.json({ success: true, logs: last50 });
  });
});

// @route   POST /api/jobs
// @desc    Create and queue a new background task
app.post('/api/jobs', (req, res) => {
  const { type } = req.body;
  if (!['report', 'sync', 'backup'].includes(type)) {
    return res.status(400).json({ success: false, message: 'Invalid job type.' });
  }
  const job = queue.createJob(type);
  res.status(202).json({ success: true, message: 'Job queued successfully.', job });
});

// @route   GET /api/jobs
// @desc    Get all jobs summary
app.get('/api/jobs', (req, res) => {
  res.json({ success: true, jobs: queue.getJobs() });
});

// @route   GET /api/jobs/:id
// @desc    Get details of a specific job (including full logs)
app.get('/api/jobs/:id', (req, res) => {
  const job = queue.getJobDetails(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }
  res.json({ success: true, job });
});

// @route   POST /api/jobs/clear
// @desc    Clear finished/failed jobs
app.post('/api/jobs/clear', (req, res) => {
  queue.clearQueue();
  res.json({ success: true, message: 'Completed/failed jobs cleared.' });
});

// @route   GET /api/cache/stats
// @desc    Fetch memory cache stats
app.get('/api/cache/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      hits: cacheHits,
      misses: cacheMisses,
      cachedKeys: Array.from(cacheStore.keys())
    }
  });
});

// @route   POST /api/cache/purge
// @desc    Reset cache stores
app.post('/api/cache/purge', (req, res) => {
  cacheStore.clear();
  cacheHits = 0;
  cacheMisses = 0;
  res.json({ success: true, message: 'Server-side cache purged successfully.' });
});

// @route   GET /api/system-report
// @desc    Simulate heavy computation, cached for 15 seconds
app.get('/api/system-report', cacheMiddleware(15), (req, res) => {
  // Heavy computation simulation
  let primes = 0;
  for (let i = 2; i < 5000000; i++) {
    let isPrime = true;
    for (let j = 2; j <= Math.sqrt(i); j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes++;
  }

  res.json({
    success: true,
    calculationTime: new Date().toLocaleTimeString(),
    result: `Identified ${primes} prime numbers in range.`,
    note: 'This response is cached for 15 seconds.'
  });
});

// 5. Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('💥 Server error:', err.stack);
  res.status(500).json({ success: false, message: 'An internal server error occurred.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
