// API functies - communicatie met AppScript backend

// Cache configuratie (5 minuten cache)
const CACHE_DURATION = 5 * 60 * 1000; // 5 minuten in milliseconden

// Functie om data op te halen van AppScript API
async function fetchDashboardData(path = 'today', rowNumber = null) {
  if (!APPSCRIPT_API_URL || APPSCRIPT_API_URL === 'YOUR_APPSCRIPT_WEB_APP_URL_HERE') {
    console.error('AppScript API URL is niet geconfigureerd. Zie config.js voor instructies.');
    return null;
  }

  // Controleer cache eerst
  const cacheKey = `dashboard_${path}_${rowNumber || 'today'}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log('Data geladen uit cache');
    return cached;
  }

  try {
    let url = APPSCRIPT_API_URL;
    if (path === 'today') {
      url += '?path=today';
    } else if (path === 'row' && rowNumber) {
      url += `?path=row&row=${rowNumber}`;
    }

    const startTime = performance.now();
    const response = await fetch(url);
    const fetchTime = performance.now() - startTime;
    console.log(`Fetch tijd: ${fetchTime.toFixed(2)}ms`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData = await response.json();
    
    // Transformeer ruwe data naar de gewenste structuur
    if (rawData.error) {
      return rawData;
    }
    
    const transformedData = transformData(rawData.headers || [], rawData.rowData || []);
    
    const result = {
      data: transformedData,
      rowNumber: rawData.rowNumber,
      dateLabel: rawData.dateLabel
    };
    
    // Sla op in cache
    setCachedData(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('Fout bij ophalen van data:', error);
    return null;
  }
}

// Cache functies
function getCachedData(key) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    // Check of cache nog geldig is
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }
    
    // Cache is verlopen, verwijder
    localStorage.removeItem(key);
    return null;
  } catch (e) {
    return null;
  }
}

function setCachedData(key, data) {
  try {
    const cache = {
      data: data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cache));
  } catch (e) {
    console.warn('Kon data niet cachen:', e);
  }
}
