# Task 7: Advanced API Usage and External API Integration

## Objective
Explore advanced API concepts by building a premium, high-performance **Weather & Air Quality Dashboard** that integrates third-party REST services (using WeatherAPI.com), secure environmental configs, server-side caching, rate limiting, and an educational OAuth 2.0 authorization sandbox.

## Features Implemented
1. **Secured API Keys (.env):** Keeps secrets out of source code by utilizing `dotenv` to load the third-party API key. 
2. **Robust Fallback Engine (Defensive Programming):** If the API key is left as a placeholder or fails due to network/credential issues, the server automatically switches to a custom **local mock weather engine** matching the exact schema of WeatherAPI. This guarantees the front-end remains fully operational.
3. **In-Memory Caching:** Implements a performant caching system in `server.js` using a custom key-value Map and TTL expiration. Subsequent calls for the same location within the cache lifespan are returned instantly without hitting the external API, reducing API usage and improving load times.
4. **Endpoint Rate Limiting:** Employs `express-rate-limit` to restrict clients to a maximum of 20 searches per 15 minutes to prevent Denial-of-Service (DoS) and API abuse.
5. **Interactive Security Sandbox:** Exposes `/api/oauth-info` detailing the structural differences, security scopes, and workflows between **API Keys** and **OAuth 2.0**.
6. **Premium Glassmorphism Front-End:**
   - Soft translucent card frames styled using backdrop filters.
   - Ambient neon glowing backgrounds (`glow-bg`).
   - Color-coded source status pills (`LIVE API`, `CACHED`, `MOCK FALLBACK`).
   - Real-time cache countdown clocks demonstrating backend caching state.
   - Animated loading spinners and smooth error alert sliders.

## File Structure
```
task7/
├── public/
│   ├── css/
│   │   └── styles.css # Design system tokens & glassmorphism layout
│   ├── js/
│   │   └── app.js     # Client side AJAX handlers & cache countdown clock
│   └── index.html     # Semantic UI skeleton & dashboard
├── .env               # Private API keys and server port configuration
├── package.json       # App metadata and dependencies
├── server.js          # Core Express engine with cache & rate limiting
└── README.md          # This documentation file
```

## Dependencies
- `express` - Backend routing.
- `dotenv` - Environmental variables injector.
- `express-rate-limit` - Client-side request throttling.

## Setup & Running
1. **Navigate to the task7 folder**:
   ```bash
   cd task7
   ```
2. **Install all packages**:
   ```bash
   npm install
   ```
3. **Configure your API Key**:
   Open `.env`. To run with live data, register for a free key at [WeatherAPI.com](https://www.weatherapi.com/) and replace the placeholder value:
   ```env
   PORT=3000
   WEATHER_API_KEY=your_weatherapi_key_here
   CACHE_TTL=600000
   ```
   *Note: If left as the default placeholder, the application automatically runs in **Mock Fallback** mode for offline testing.*
4. **Start the server**:
   ```bash
   node server.js
   ```
5. **Open your browser** and visit http://localhost:3000.

## API Endpoints Overview
- `GET /api/weather?city=<name>`: Checks local memory cache. If missed, queries third-party API (or local mock engine if keyless) and caches the response.
- `GET /api/oauth-info`: Serves educational descriptions detailing API Keys vs OAuth 2.0 authorization architectures.

## Learning Outcomes
- **Security Engineering:** Managing credentials securely inside server-side environment files.
- **System Throttling:** Guarding endpoints against request surges using client IP rate limits.
- **Cache Management:** Designing client/server expiration loops to decrease external latency and limit API billing costs.
- **Secure Authentication Frameworks:** Investigating delegation flows (OAuth 2.0 authorization code grant) vs authentication identification models (API Keys).
- **Graceful Degradation:** Structuring backend logic with custom fallback states (mock generators) so the application degrades gracefully under failures.
