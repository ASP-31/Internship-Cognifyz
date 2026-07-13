// Client-Side Dashboard Operations - Task 8

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const cpuBar = document.getElementById('cpu-bar');
  const cpuText = document.getElementById('cpu-text');
  const memBar = document.getElementById('mem-bar');
  const memText = document.getElementById('mem-text');
  const uptimeDisplay = document.getElementById('uptime-display');

  const btnTriggerHeavy = document.getElementById('btn-trigger-heavy');
  const btnPurgeCache = document.getElementById('btn-purge-cache');
  const heavyResult = document.getElementById('heavy-result');
  const heavyResultText = document.getElementById('heavy-result-text');
  const heavyResultTime = document.getElementById('heavy-result-time');
  const heavyCacheBadge = document.getElementById('heavy-cache-badge');
  const cacheHitsText = document.getElementById('cache-hits');
  const cacheMissesText = document.getElementById('cache-misses');
  const cachedKeysList = document.getElementById('cached-keys-list');

  const spawnButtons = document.querySelectorAll('.btn-spawn');
  const btnClearQueue = document.getElementById('btn-clear-queue');
  const jobsList = document.getElementById('jobs-list');
  const jobDetailsPanel = document.getElementById('job-details-panel');

  const terminalScreen = document.getElementById('terminal-screen');

  // State
  let selectedJobId = null;
  let activeJobsCount = 0;
  const startTime = Date.now();

  // 1. System Metrics Simulation
  setInterval(() => {
    // If background jobs are running, simulate higher CPU utilization
    const baseCpu = activeJobsCount > 0 ? 55 : 12;
    const cpuVal = Math.round(baseCpu + (Math.random() * 10 - 5));
    const finalCpu = Math.max(5, Math.min(99, cpuVal));
    cpuBar.style.width = `${finalCpu}%`;
    cpuText.textContent = `${finalCpu}%`;

    const baseMem = activeJobsCount > 0 ? 46 : 41;
    const memVal = Math.round(baseMem + (Math.random() * 2 - 1));
    memBar.style.width = `${memVal}%`;
    memText.textContent = `${memVal}%`;
  }, 1000);

  // Uptime Counter
  setInterval(() => {
    const deltaSec = Math.floor((Date.now() - startTime) / 1000);
    const hrs = String(Math.floor(deltaSec / 3600)).padStart(2, '0');
    const mins = String(Math.floor((deltaSec % 3600) / 60)).padStart(2, '0');
    const secs = String(deltaSec % 60).padStart(2, '0');
    uptimeDisplay.textContent = `${hrs}:${mins}:${secs}`;
  }, 1000);

  // 2. Caching Operations
  btnTriggerHeavy.addEventListener('click', async () => {
    btnTriggerHeavy.disabled = true;
    btnTriggerHeavy.textContent = 'Executing Complex Primes Calculation...';
    heavyResult.classList.remove('hidden');
    heavyResultText.textContent = 'Calculating prime numbers on server (simulating heavy database queries)...';
    heavyResultTime.textContent = '';
    heavyCacheBadge.className = 'badge';
    heavyCacheBadge.textContent = 'WAITING';

    try {
      const start = performance.now();
      const response = await fetch('/api/system-report');
      const payload = await response.json();
      const duration = Math.round(performance.now() - start);

      if (payload.success) {
        heavyResultText.textContent = payload.result;
        heavyResultTime.textContent = `Calculated at: ${payload.calculationTime} (Network Duration: ${duration}ms)`;
        
        // Read X-Cache custom header
        const cacheHeader = response.headers.get('X-Cache') || 'MISS';
        heavyCacheBadge.textContent = cacheHeader === 'HIT' ? 'CACHE HIT' : 'CACHE MISS';
        heavyCacheBadge.className = `badge ${cacheHeader === 'HIT' ? 'badge-success' : 'badge-warning'}`;
      }
    } catch (error) {
      heavyResultText.textContent = 'Failed to calculate. Verify server is online.';
      heavyCacheBadge.textContent = 'ERROR';
      heavyCacheBadge.className = 'badge';
    } finally {
      btnTriggerHeavy.disabled = false;
      btnTriggerHeavy.textContent = 'Compute Prime Numbers (15s cache)';
      refreshCacheStats();
    }
  });

  btnPurgeCache.addEventListener('click', async () => {
    try {
      const response = await fetch('/api/cache/purge', { method: 'POST' });
      const payload = await response.json();
      if (payload.success) {
        // Clear result UI
        heavyResult.classList.add('hidden');
        refreshCacheStats();
      }
    } catch (err) {
      console.error('Failed to purge cache:', err);
    }
  });

  async function refreshCacheStats() {
    try {
      const response = await fetch('/api/cache/stats');
      const payload = await response.json();
      if (payload.success) {
        const { stats } = payload;
        cacheHitsText.textContent = stats.hits;
        cacheMissesText.textContent = stats.misses;

        // Render cached keys
        cachedKeysList.innerHTML = '';
        if (stats.cachedKeys.length === 0) {
          cachedKeysList.innerHTML = '<li class="empty-list">No active cached endpoints.</li>';
        } else {
          stats.cachedKeys.forEach(key => {
            const li = document.createElement('li');
            li.className = 'cache-key-item';
            li.textContent = key;
            cachedKeysList.appendChild(li);
          });
        }
      }
    } catch (err) {
      console.error('Error refreshing cache stats:', err);
    }
  }

  // 3. Background Queue Operations
  spawnButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const type = btn.getAttribute('data-type');
      try {
        const response = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type })
        });
        const payload = await response.json();
        if (payload.success) {
          // If no job is currently selected, auto-select this new one
          if (!selectedJobId) {
            selectedJobId = payload.job.id;
          }
          refreshJobsList();
        }
      } catch (err) {
        console.error('Failed to spawn job:', err);
      }
    });
  });

  btnClearQueue.addEventListener('click', async () => {
    try {
      await fetch('/api/jobs/clear', { method: 'POST' });
      selectedJobId = null;
      jobDetailsPanel.innerHTML = '<p class="empty-msg">Select a job above to view its live execution logs.</p>';
      jobDetailsPanel.classList.add('empty');
      refreshJobsList();
    } catch (err) {
      console.error(err);
    }
  });

  async function refreshJobsList() {
    try {
      const response = await fetch('/api/jobs');
      const payload = await response.json();
      if (payload.success) {
        const { jobs } = payload;
        
        // Count active/processing jobs
        activeJobsCount = jobs.filter(j => j.status === 'processing' || j.status === 'pending').length;

        if (jobs.length === 0) {
          jobsList.innerHTML = '<p class="empty-list">No tasks in the scheduler. Dispatch a job above!</p>';
          return;
        }

        // Keep track of IDs in the new draw to see if our selected job still exists
        const jobIds = jobs.map(j => j.id);
        if (selectedJobId && !jobIds.includes(selectedJobId)) {
          selectedJobId = null;
          jobDetailsPanel.innerHTML = '<p class="empty-msg">Select a job above to view its live execution logs.</p>';
          jobDetailsPanel.classList.add('empty');
        }

        // If a job is active, auto-select it if nothing else is selected
        const activeJob = jobs.find(j => j.status === 'processing');
        if (activeJob && !selectedJobId) {
          selectedJobId = activeJob.id;
        }

        jobsList.innerHTML = '';
        jobs.forEach(job => {
          const div = document.createElement('div');
          div.className = `job-item ${selectedJobId === job.id ? 'selected' : ''}`;
          div.setAttribute('data-id', job.id);
          div.addEventListener('click', () => {
            selectedJobId = job.id;
            refreshJobsList(); // Redraw selection outline
            fetchJobLogs(job.id);
          });

          // Build inner contents
          div.innerHTML = `
            <div class="job-meta">
              <span class="job-name">${job.name}</span>
              <span class="job-status-label status-${job.status}">${job.status}</span>
            </div>
            <div class="job-progress-container">
              <div class="job-progress-track">
                <div class="job-progress-bar" style="width: ${job.progress}%"></div>
              </div>
              <span class="job-progress-pct">${job.progress}%</span>
            </div>
          `;
          jobsList.appendChild(div);
        });

        // Fetch logs for selected job
        if (selectedJobId) {
          fetchJobLogs(selectedJobId);
        }
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  }

  async function fetchJobLogs(id) {
    try {
      const response = await fetch(`/api/jobs/${id}`);
      const payload = await response.json();
      if (payload.success) {
        const { job } = payload;
        jobDetailsPanel.classList.remove('empty');
        jobDetailsPanel.innerHTML = '';

        const title = document.createElement('div');
        title.className = 'log-entry';
        title.style.color = '#38bdf8'; // Sky blue
        title.style.fontWeight = '600';
        title.style.marginBottom = '0.5rem';
        title.textContent = `監査ログ (Audit Log) - ${job.name} [ID: ${job.id}]`;
        jobDetailsPanel.appendChild(title);

        job.logs.forEach(log => {
          const p = document.createElement('p');
          p.className = 'log-entry';
          p.textContent = log;
          jobDetailsPanel.appendChild(p);
        });

        // Auto-scroll
        jobDetailsPanel.scrollTop = jobDetailsPanel.scrollHeight;
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Polling loops for queue list
  setInterval(refreshJobsList, 700);

  // 4. Live Middleware Console Log Poller
  async function refreshServerLogs() {
    try {
      const response = await fetch('/api/logs');
      const payload = await response.json();
      if (payload.success) {
        const { logs } = payload;
        terminalScreen.innerHTML = '';
        
        if (logs.length === 0) {
          terminalScreen.innerHTML = '<div class="terminal-line text-dim">No request logs generated yet. Click query buttons to generate logs.</div>';
          return;
        }

        logs.forEach(line => {
          const div = document.createElement('div');
          div.className = 'terminal-line';
          
          // Color code requests
          if (line.includes('GET')) {
            div.innerHTML = `<span style="color: #60a5fa;">[GET]</span> ${escapeHtml(line)}`;
          } else if (line.includes('POST')) {
            div.innerHTML = `<span style="color: #c084fc;">[POST]</span> ${escapeHtml(line)}`;
          } else {
            div.textContent = line;
          }

          terminalScreen.appendChild(div);
        });
      }
    } catch (err) {
      console.error('Failed to fetch request logs:', err);
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Polling loop for request terminal (1.5 seconds)
  setInterval(refreshServerLogs, 1500);

  // Run on startup
  refreshCacheStats();
  refreshServerLogs();
});
