// REST API endpoint voor data ophalen
function doGet(e) {
  const path = e.parameter.path || 'today';
  let result;
  
  if (path === 'today') {
    result = getDashboardDataForToday();
  } else if (path === 'row' && e.parameter.row) {
    const rowNumber = parseInt(e.parameter.row, 10);
    const data = getDashboardData(rowNumber);
    const sh = getSheet();
    const dateValue = sh.getRange(rowNumber, 1).getDisplayValue();
    
    result = {
      data,
      rowNumber,
      dateLabel: dateValue
    };
  } else {
    // Fallback: return error
    result = { error: 'Invalid path' };
  }
  
  // Return JSON met CORS headers voor cross-origin requests
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
const TAB_NAME = '2025';

const SECTION_COLUMNS = {
  notes: [
    { column: 'C', header: 'NOTITIES', label: 'Notities' }
  ],
  boven: [
    { column: 'E', header: 'SET 1 - Rector' },
    { column: 'F', header: 'SET 2 - Tekenen' },
    { column: 'G', header: 'SET 3 - Rekenen' },
    { column: 'H', header: 'SET 4 - Nederlands' },
    { column: 'I', header: 'SET 5 - Laboratorium' },
    { column: 'J', header: 'SET 6 - Biologie' },
    { column: 'K', header: 'SET 7 - Geschiedenis' },
    { column: 'L', header: 'SET 8 - Bibliotheek' }
  ],
  begane: [
    { column: 'Q', header: 'SET 9 - Directie' },
    { column: 'R', header: 'SET 10 - Apenkooi' },
    { column: 'S', header: 'SET 11 - Ballenhok' },
    { column: 'T', header: 'SET 12 - Klimop' },
    { column: 'U', header: 'SET 13 - Gymzaal' },
    { column: 'V', header: 'SET 14 - Congierce' }
  ],
  kelder: [
    { column: 'X', header: 'SET 15 - Brommerhok' },
    { column: 'Y', header: 'SET 16 - Fietsenhok' },
    { column: 'AR', header: 'Set 28 - Speelkwartier' }
  ],
  audio: [
    { column: 'AH', header: 'Set 21 - Gitaarles', label: 'Gitaarles Protools' },
    { column: 'AI', header: 'Set 22 - Zangles (VO)', label: 'Zangles Voice-Over' },
    { column: 'AJ', header: 'Set 23 - Drumles', label: 'Drumles Protools' },
    { column: 'AK', header: 'Set 24 - Trompetles (VO)', label: 'Trompetles Voice-Over' }
  ],
  color: [
    { column: 'AM', header: 'Set 25 -Toneel (Davinci)', label: 'Toneel' },
    { column: 'AN', header: 'Set 26 - Klein theater (Nucoda', label: 'Klein Theater' },
    { column: 'AO', header: 'Set 27 - Drama (Davinci)', label: 'Drama' }
  ],
  remote: [
    { column: 'AC', header: 'REMOTE HUISWERK 01' },
    { column: 'AD', header: 'REMOTE HUISWERK 02' },
    { column: 'AE', header: 'REMOTE HUISWERK 03' },
    { column: 'AAF', header: 'REMOTE HUISWERK 04' }
  ]
};

function getSheet() {
  const ss = SpreadsheetApp.openById('1wt46WoqbRJg5suLljYUlMx8Gqs_voRV4D0QcbQVA6t4');
  return ss.getSheetByName(TAB_NAME);
}

function getDashboardData(rowNumber) {
  const sh = getSheet();
  const lastCol = sh.getLastColumn();
  const headers = sh.getRange(1, 1, 1, lastCol).getDisplayValues()[0];

  const requestedRow = parseInt(rowNumber, 10);
  const safeRow = !isNaN(requestedRow) && requestedRow >= 2 ? requestedRow : 2;
  const rowValues = sh.getRange(safeRow, 1, 1, lastCol).getDisplayValues()[0];

  const result = {};

  Object.entries(SECTION_COLUMNS).forEach(([key, entries]) => {
    result[key] = entries.map(entry => {
      const colIndex = columnLetterToIndex(entry.column);
      const label =
        entry.label ||
        extractSuiteNaam(entry.header || headers[colIndex] || '') ||
        `Kolom ${entry.column}`;

      if (colIndex === -1 || colIndex >= rowValues.length) {
        Logger.log(`Kolom ${entry.column} niet gevonden voor sectie ${key}`);
        return { label, value: '' };
      }

      return { label, value: rowValues[colIndex] || '' };
    });
  });

  return result;
}

function getDashboardDataForToday() {
  const sh = getSheet();
  if (!sh) {
    return { data: {}, rowNumber: null, dateLabel: '' };
  }

  const timeZone = Session.getScriptTimeZone() || 'Europe/Amsterdam';
  const todayString = Utilities.formatDate(new Date(), timeZone, 'dd-MM-yyyy');
  const rowNumber = findRowNumberByDate(sh, todayString);
  const data = rowNumber ? getDashboardData(rowNumber) : {};

  return {
    data,
    rowNumber,
    dateLabel: todayString
  };
}

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

function extractSuiteNaam(str) {
  if (!str) return '';
  const idx = String(str).indexOf('-');
  if (idx === -1) return String(str).trim();
  return String(str).slice(idx + 1).trim();
}

function columnLetterToIndex(letter) {
  if (!letter) return -1;
  const clean = String(letter).trim().toUpperCase();
  let index = 0;
  for (let i = 0; i < clean.length; i++) {
    const code = clean.charCodeAt(i);
    if (code < 65 || code > 90) return -1;
    index = index * 26 + (code - 64);
  }
  return index - 1;
}