/**
 * API functies
 * 
 * Communicatie met AppScript backend en caching functionaliteit.
 */

/**
 * Cache duur configuratie
 * 
 * @constant {number}
 * @default 30000 (30 seconden in milliseconden)
 * Verkort naar 30 seconden voor snellere updates van spreadsheet wijzigingen
 */
const CACHE_DURATION = 30 * 1000; // 30 seconden in milliseconden

/**
 * Haalt data op van AppScript API
 * 
 * Haalt dashboard data op van de AppScript backend. Gebruikt caching om
 * onnodige API calls te voorkomen. Transformeert ruwe data naar gestructureerde format.
 * 
 * @param {string} path - API path ('today' of 'row')
 * @param {number|null} rowNumber - Rij nummer (alleen nodig bij path='row')
 * @returns {Promise<Object|null>} 
 *   Data object met {data, rowNumber, dateLabel} of null bij fout
 * 
 * @example
 * // Haal data op voor vandaag
 * const todayData = await fetchDashboardData('today');
 * 
 * // Haal data op voor specifieke rij
 * const rowData = await fetchDashboardData('row', 5);
 */
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

/**
 * ============================================
 * CACHE FUNCTIES
 * ============================================
 */

/**
 * Haalt gecachte data op
 * 
 * Controleert of er gecachte data bestaat voor de gegeven key en of deze nog geldig is.
 * 
 * @param {string} key - Cache key
 * @returns {Object|null} Gecachte data of null als niet gevonden/verlopen
 */
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

/**
 * Slaat data op in cache
 * 
 * Slaat data op in localStorage met timestamp voor cache validatie.
 * 
 * @param {string} key - Cache key
 * @param {Object} data - Data om op te slaan
 */
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
