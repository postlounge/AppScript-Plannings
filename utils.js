/**
 * Utility functies
 * 
 * Helper functies voor data transformatie en conversie.
 */

/**
 * Converteert kolom letter naar index
 * 
 * Converteert spreadsheet kolom letters (A, B, AA, etc.) naar 0-based index.
 * 
 * @param {string} letter - Kolom letter (bijv. 'A', 'B', 'AA')
 * @returns {number} 0-based index, of -1 bij ongeldige input
 * 
 * @example
 * columnLetterToIndex('A') // returns 0
 * columnLetterToIndex('B') // returns 1
 * columnLetterToIndex('AA') // returns 26
 */
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

/**
 * Extraheert suite naam uit header string
 * 
 * Haalt de suite naam uit een header string door alles na het eerste '-' te nemen.
 * 
 * @param {string} str - Header string (bijv. "SET 1 - Rector")
 * @returns {string} Suite naam (bijv. "Rector"), of de hele string als er geen '-' is
 * 
 * @example
 * extractSuiteNaam("SET 1 - Rector") // returns "Rector"
 * extractSuiteNaam("Directie") // returns "Directie"
 */
function extractSuiteNaam(str) {
  if (!str) return '';
  const idx = String(str).indexOf('-');
  if (idx === -1) return String(str).trim();
  return String(str).slice(idx + 1).trim();
}

/**
 * Transformeert ruwe data naar de gewenste structuur
 * 
 * Neemt ruwe spreadsheet data (headers en rowData) en transformeert deze naar
 * een gestructureerd object op basis van SECTION_COLUMNS configuratie.
 * 
 * @param {Array<string>} headers - Array met header namen uit spreadsheet
 * @param {Array<string>} rowData - Array met data waarden uit spreadsheet rij
 * @returns {Object<string, Array<{label: string, value: string}>>} 
 *   Gestructureerd object met secties als keys en arrays van {label, value} pairs
 * 
 * @example
 * transformData(['Datum', 'SET 1 - Rector'], ['01-01-2025', 'Bezet'])
 * // returns { boven: [{label: 'Rector', value: 'Bezet'}] }
 */
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

