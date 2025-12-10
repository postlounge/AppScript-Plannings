// API functies - communicatie met AppScript backend

// Functie om data op te halen van AppScript API
async function fetchDashboardData(path = 'today', rowNumber = null) {
  if (!APPSCRIPT_API_URL || APPSCRIPT_API_URL === 'YOUR_APPSCRIPT_WEB_APP_URL_HERE') {
    console.error('AppScript API URL is niet geconfigureerd. Zie config.js voor instructies.');
    return null;
  }

  try {
    let url = APPSCRIPT_API_URL;
    if (path === 'today') {
      url += '?path=today';
    } else if (path === 'row' && rowNumber) {
      url += `?path=row&row=${rowNumber}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData = await response.json();
    
    // Transformeer ruwe data naar de gewenste structuur
    if (rawData.error) {
      return rawData;
    }
    
    const transformedData = transformData(rawData.headers || [], rawData.rowData || []);
    
    return {
      data: transformedData,
      rowNumber: rawData.rowNumber,
      dateLabel: rawData.dateLabel
    };
  } catch (error) {
    console.error('Fout bij ophalen van data:', error);
    return null;
  }
}

