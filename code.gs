// REST API endpoint voor GitHub Pages frontend
// Deze code.gs is specifiek voor gebruik met GitHub Pages
// Deploy deze als Web App in Google Apps Script
// 
// Deze versie geeft alleen ruwe data terug - alle configuratie en transformatie
// gebeurt in de frontend (script.js)

const TAB_NAME = '2025';
const SPREADSHEET_ID = '1vi902Bu5j1mCzdBjqYTKAOfzgDjt5SXaJm6uD86jSI8';

// REST API endpoint voor data ophalen
function doGet(e) {
  const path = e.parameter.path || 'today';
  let result;
  
  if (path === 'today') {
    result = getDataForToday();
  } else if (path === 'row' && e.parameter.row) {
    const rowNumber = parseInt(e.parameter.row, 10);
    result = getRowData(rowNumber);
  } else {
    result = { error: 'Invalid path' };
  }
  
  // CORS headers voor GitHub Pages compatibility
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON)
    .addHeader('Access-Control-Allow-Origin', '*')
    .addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .addHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Cache voor sheet object (blijft actief tijdens script execution)
let cachedSheet = null;

function getSheet() {
  // Cache sheet object om meerdere calls te vermijden
  if (!cachedSheet) {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    cachedSheet = ss.getSheetByName(TAB_NAME);
  }
  return cachedSheet;
}

// Haalt ruwe data op voor een specifieke rij
function getRowData(rowNumber) {
  const sh = getSheet();
  if (!sh) {
    return { error: 'Sheet not found' };
  }
  
  const lastCol = sh.getLastColumn();
  const lastRow = sh.getLastRow();
  
  // Valideer rij nummer
  const safeRow = Math.max(2, Math.min(rowNumber, lastRow));
  
  // Haal headers op (rij 1)
  const headers = sh.getRange(1, 1, 1, lastCol).getDisplayValues()[0];
  
  // Haal rij data op
  const rowValues = sh.getRange(safeRow, 1, 1, lastCol).getDisplayValues()[0];
  
  // Haal datum op (kolom A)
  const dateValue = sh.getRange(safeRow, 1).getDisplayValue();
  
  return {
    rowNumber: safeRow,
    dateLabel: dateValue,
    headers: headers,
    rowData: rowValues
  };
}

// Haalt data op voor vandaag
function getDataForToday() {
  const sh = getSheet();
  if (!sh) {
    return { error: 'Sheet not found' };
  }
  
  const timeZone = Session.getScriptTimeZone() || 'Europe/Amsterdam';
  const todayString = Utilities.formatDate(new Date(), timeZone, 'dd-MM-yyyy');
  const rowNumber = findRowNumberByDate(sh, todayString);
  
  if (!rowNumber) {
    return {
      rowNumber: null,
      dateLabel: todayString,
      headers: [],
      rowData: []
    };
  }
  
  return getRowData(rowNumber);
}

// Zoekt rij nummer op basis van datum
function findRowNumberByDate(sh, targetDateString) {
  if (!sh || !targetDateString) return null;
  
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return null;
  
  const numberOfRows = lastRow - 1;
  const dateValues = sh.getRange(2, 1, numberOfRows, 1).getDisplayValues();
  
  for (let i = 0; i < dateValues.length; i++) {
    const cellValue = (dateValues[i][0] || '').trim();
    if (cellValue === targetDateString) {
      return i + 2;
    }
  }
  
  return null;
}
