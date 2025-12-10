// Utility functies - helper functies voor data transformatie

// Converteert kolom letter (A, B, AA, etc.) naar index (0-based)
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

// Extraheert suite naam uit header string (bijv. "SET 1 - Rector" -> "Rector")
function extractSuiteNaam(str) {
  if (!str) return '';
  const idx = String(str).indexOf('-');
  if (idx === -1) return String(str).trim();
  return String(str).slice(idx + 1).trim();
}

// Transformeert ruwe data naar de gewenste structuur
function transformData(headers, rowData) {
  const result = {};
  
  Object.entries(SECTION_COLUMNS).forEach(([key, entries]) => {
    result[key] = entries.map(entry => {
      const colIndex = columnLetterToIndex(entry.column);
      
      // Bepaal label
      const label =
        entry.label ||
        extractSuiteNaam(entry.header || (headers[colIndex] || '')) ||
        `Kolom ${entry.column}`;
      
      // Haal waarde op
      let value = '';
      if (colIndex >= 0 && colIndex < rowData.length) {
        value = rowData[colIndex] || '';
      }
      
      return { label, value: value.trim() };
    });
  });
  
  return result;
}

