// Client-Side Application Logic - Task 7

document.addEventListener('DOMContentLoaded', () => {
  const cityInput = document.getElementById('city-input');
  const searchBtn = document.getElementById('search-btn');
  const weatherContainer = document.getElementById('weather-container');
  const loadingSpinner = document.getElementById('loading-spinner');
  const errorMessage = document.getElementById('error-message');

  // Weather variables
  const locName = document.getElementById('loc-name');
  const locRegion = document.getElementById('loc-region');
  const sourceBadge = document.getElementById('source-badge');
  const tempVal = document.getElementById('temp-val');
  const weatherIcon = document.getElementById('weather-icon');
  const conditionText = document.getElementById('condition-text');
  const humidityVal = document.getElementById('humidity-val');
  const windVal = document.getElementById('wind-val');
  const aqiVal = document.getElementById('aqi-val');
  const aqiDesc = document.getElementById('aqi-desc');
  const locTime = document.getElementById('loc-time');
  const cacheTimer = document.getElementById('cache-timer');
  const cacheTimeLeft = document.getElementById('cache-time-left');

  // Security variables
  const toggleApiKey = document.getElementById('toggle-api-key');
  const toggleOauth = document.getElementById('toggle-oauth');
  const authLoading = document.getElementById('auth-loading');
  const authContent = document.getElementById('auth-content');
  const authTitle = document.getElementById('auth-title');
  const authPurpose = document.getElementById('auth-purpose');
  const authScope = document.getElementById('auth-scope');
  const authSecurity = document.getElementById('auth-security');
  const authWorkflow = document.getElementById('auth-workflow');

  let countdownInterval = null;
  let cachedOAuthData = null;

  // AQI EPA scale mapper
  const aqiLevels = {
    1: { level: '1 (Good)', text: 'Excellent air quality, poses little or no risk.' },
    2: { level: '2 (Moderate)', text: 'Acceptable quality; moderate health concerns for few.' },
    3: { level: '3 (Unhealthy for Sensitive)', text: 'Sensitive groups may experience health effects.' },
    4: { level: '4 (Unhealthy)', text: 'Everyone may begin to experience health implications.' },
    5: { level: '5 (Very Unhealthy)', text: 'Health alert: everyone may experience serious effects.' },
    6: { level: '6 (Hazardous)', text: 'Emergency warning: entire population likely affected.' }
  };

  // Weather query event binding
  searchBtn.addEventListener('click', performSearch);
  cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });

  async function performSearch() {
    const city = cityInput.value.trim();
    if (!city) {
      showError('Please enter a valid city name.');
      return;
    }

    // Reset UI state
    hideError();
    clearInterval(countdownInterval);
    cacheTimer.classList.add('hidden');
    weatherContainer.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const payload = await response.json();

      loadingSpinner.classList.add('hidden');

      if (!response.ok || !payload.success) {
        showError(payload.message || `Server returned error status ${response.status}`);
        return;
      }

      renderWeatherData(payload);
    } catch (error) {
      loadingSpinner.classList.add('hidden');
      showError('Failed to communicate with the server. Please check your connection.');
    }
  }

  function renderWeatherData(payload) {
    const { source, data, expiresIn } = payload;
    const { location, current } = data;

    // 1. Text elements
    locName.textContent = location.name;
    locRegion.textContent = `${location.region ? location.region + ', ' : ''}${location.country}`;
    tempVal.textContent = Math.round(current.temp_c);
    conditionText.textContent = current.condition.text;
    
    // Ensure image source is fully formed
    const iconUrl = current.condition.icon.startsWith('//') ? 'https:' + current.condition.icon : current.condition.icon;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = current.condition.text;

    humidityVal.textContent = `${current.humidity}%`;
    windVal.textContent = `${current.wind_kph} km/h`;

    // AQI index mapping
    const epaIndex = current.air_quality && current.air_quality['us-epa-index'] ? current.air_quality['us-epa-index'] : 1;
    const aqiMap = aqiLevels[epaIndex] || { level: 'Unknown', text: 'N/A' };
    aqiVal.textContent = aqiMap.level;
    aqiDesc.textContent = aqiMap.text;

    // Time representation
    locTime.textContent = new Date(location.localtime.replace(/-/g, '/')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 2. Status Badge styling
    sourceBadge.className = 'badge'; // Reset classes
    if (source === 'cache') {
      sourceBadge.classList.add('badge-cache');
      sourceBadge.textContent = 'Cached';
      
      // Start cache countdown timer
      if (expiresIn && expiresIn > 0) {
        let secondsLeft = expiresIn;
        cacheTimeLeft.textContent = secondsLeft;
        cacheTimer.classList.remove('hidden');
        
        countdownInterval = setInterval(() => {
          secondsLeft--;
          cacheTimeLeft.textContent = secondsLeft;
          if (secondsLeft <= 0) {
            clearInterval(countdownInterval);
            cacheTimer.innerHTML = '🔄 Cache expired. Next query fetches live data.';
          }
        }, 1000);
      }
    } else if (source === 'api') {
      sourceBadge.classList.add('badge-api');
      sourceBadge.textContent = 'Live API';
    } else {
      sourceBadge.classList.add('badge-mock');
      sourceBadge.textContent = 'Mock Fallback';
    }

    weatherContainer.classList.remove('hidden');
  }

  // Error feedback methods
  function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
  }

  function hideError() {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
  }

  // Security Sandbox - Load OAuth Data from server
  async function fetchSecurityData() {
    try {
      const response = await fetch('/api/oauth-info');
      const payload = await response.json();
      if (payload.success) {
        cachedOAuthData = payload.concepts;
        authLoading.classList.add('hidden');
        authContent.classList.remove('hidden');
        // Render default (API Keys)
        renderAuthConcept('apiKeys');
      }
    } catch (error) {
      console.error('Failed to load OAuth conceptual info:', error);
      authLoading.innerHTML = '<p class="error">Failed to fetch sandbox details.</p>';
    }
  }

  function renderAuthConcept(key) {
    if (!cachedOAuthData || !cachedOAuthData[key]) return;
    const concept = cachedOAuthData[key];
    authTitle.textContent = concept.title;
    authPurpose.textContent = concept.purpose;
    authScope.textContent = concept.scope;
    authSecurity.textContent = concept.security;
    authWorkflow.textContent = concept.workflow;
  }

  toggleApiKey.addEventListener('click', () => {
    toggleApiKey.classList.add('active');
    toggleOauth.classList.remove('active');
    renderAuthConcept('apiKeys');
  });

  toggleOauth.addEventListener('click', () => {
    toggleOauth.classList.add('active');
    toggleApiKey.classList.remove('active');
    renderAuthConcept('oauth2');
  });

  // Run on start
  fetchSecurityData();
});
