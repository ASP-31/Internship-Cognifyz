// server.js
const express = require('express');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Parse incoming JSON payloads
app.use(express.json());

// Serve static front-end assets
app.use(express.static('public'));

// 1. Rate Limiting Middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // Limit each IP to 20 requests per window for demonstration
  standardHeaders: true, // Return rate limit info in standard headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many weather queries from this IP. Please wait 15 minutes and try again.'
    });
  }
});

// Apply rate limiter to API routes
app.use('/api/', apiLimiter);

// 2. In-Memory Cache Store
const cacheStore = new Map();
const CACHE_TTL = parseInt(process.env.CACHE_TTL, 10) || 600000; // default 10 minutes

// Helper: Clean up expired cache items periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, item] of cacheStore.entries()) {
    if (now > item.expiresAt) {
      cacheStore.delete(key);
    }
  }
}, 60000); // Check every minute

// Helper: Generate realistic fallback mock data if API key is invalid or offline
function getMockWeatherData(city) {
  const capitalized = city.charAt(0).toUpperCase() + city.slice(1);
  let hash = 0;
  for (let i = 0; i < city.length; i++) {
    hash = city.charCodeAt(i) + ((hash << 5) - hash);
  }
  const temp = Math.round(10 + (Math.abs(hash) % 25)); // 10°C to 35°C
  const conditions = ['Sunny', 'Partly Cloudy', 'Mist', 'Moderate Rain', 'Heavy Rain', 'Clear'];
  const conditionText = conditions[Math.abs(hash) % conditions.length];
  
  // Choose standard icon code based on conditions
  let iconId = 113; // Sunny
  if (conditionText === 'Partly Cloudy') iconId = 116;
  if (conditionText === 'Mist') iconId = 143;
  if (conditionText === 'Moderate Rain') iconId = 296;
  if (conditionText === 'Heavy Rain') iconId = 308;

  const humidity = 35 + (Math.abs(hash) % 55); // 35% to 90%
  const windKph = Math.round(5 + (Math.abs(hash) % 35)); // 5 to 40 kph
  const aqiIndex = (Math.abs(hash) % 6) + 1; // 1 (Good) to 6 (Hazardous)
  
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  const currentTime = new Date().toLocaleTimeString([], options);

  return {
    location: {
      name: capitalized,
      region: 'Virtual Region',
      country: 'Mockland',
      localtime: `2026-07-13 ${currentTime}`
    },
    current: {
      temp_c: temp,
      condition: {
        text: conditionText,
        icon: `//cdn.weatherapi.com/weather/64x64/day/${iconId}.png`
      },
      wind_kph: windKph,
      humidity: humidity,
      air_quality: {
        "us-epa-index": aqiIndex
      }
    }
  };
}

// 3. API Endpoints

// @route   GET /api/weather
// @desc    Fetch weather with in-memory caching and mock fallback
app.get('/api/weather', async (req, res, next) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ success: false, message: 'City parameter is required.' });
  }

  const cacheKey = city.trim().toLowerCase();
  const now = Date.now();

  // Check cache hit
  if (cacheStore.has(cacheKey)) {
    const cachedItem = cacheStore.get(cacheKey);
    if (now < cachedItem.expiresAt) {
      console.log(`🎯 Cache HIT for: "${cacheKey}"`);
      return res.json({
        success: true,
        source: 'cache',
        expiresIn: Math.round((cachedItem.expiresAt - now) / 1000),
        data: cachedItem.data
      });
    } else {
      console.log(`⏳ Cache expired for: "${cacheKey}". Re-fetching...`);
      cacheStore.delete(cacheKey);
    }
  }

  console.log(`🌐 Cache MISS for: "${cacheKey}". Querying third-party API...`);

  const apiKey = process.env.WEATHER_API_KEY;
  const isPlaceholder = !apiKey || apiKey === 'your_weatherapi_key_placeholder' || apiKey.trim() === '';

  if (isPlaceholder) {
    console.log(`⚠️ Placeholder/empty API key detected. Falling back to local Mock engine.`);
    const mockData = getMockWeatherData(cacheKey);
    // Cache the mock data too so caching functionality can be verified with mock data
    cacheStore.set(cacheKey, {
      data: mockData,
      expiresAt: now + CACHE_TTL
    });
    return res.json({
      success: true,
      source: 'mock',
      data: mockData
    });
  }

  try {
    // Call WeatherAPI (includes air quality index "aqi=yes")
    const apiURL = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=yes`;
    const response = await fetch(apiURL);
    
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Response Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    
    // Save to Cache
    cacheStore.set(cacheKey, {
      data: data,
      expiresAt: now + CACHE_TTL
    });

    res.json({
      success: true,
      source: 'api',
      data: data
    });
  } catch (error) {
    console.error(`❌ External Fetch Failed: ${error.message}. Falling back to mock data...`);
    // Graceful error handling: Fallback to mock data on network errors
    const mockData = getMockWeatherData(cacheKey);
    res.json({
      success: true,
      source: 'fallback-mock',
      note: 'Network or API credential error; loaded fallback mock data.',
      data: mockData
    });
  }
});

// @route   GET /api/oauth-info
// @desc    Educational details on OAuth vs API Keys
app.get('/api/oauth-info', (req, res) => {
  res.json({
    success: true,
    concepts: {
      apiKeys: {
        title: "API Keys",
        purpose: "Identifies the calling project (application) making the request.",
        scope: "All-or-nothing authorization. Typically static and sent via headers or query strings.",
        security: "Vulnerable if exposed. Ideal for backend-to-backend calls with trusted resources.",
        workflow: "1. App registers with service -> 2. Service issues secret key -> 3. App passes key in every request."
      },
      oauth2: {
        title: "OAuth 2.0",
        purpose: "Delegates user authorization to a third-party application without sharing user credentials.",
        scope: "Granular access scopes. Employs short-lived Access Tokens, Refresh Tokens, and user consent screens.",
        security: "Highly secure. Token lifecycle is managed and restricted to specific actions/scopes.",
        workflow: "1. User requests auth -> 2. Redirect to auth server -> 3. User grants consent -> 4. App receives Auth Code -> 5. Exchange code for Access Token -> 6. App accesses API using token."
      }
    }
  });
});

// 4. Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('💥 Unhandled Server Exception:', err.stack);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred.'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
