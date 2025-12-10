// Configuratie bestand
// Hier staan alle configuratie instellingen

// AppScript Web App URL - Vervang dit met je eigen URL na deploy
const APPSCRIPT_API_URL = 'YOUR_APPSCRIPT_WEB_APP_URL_HERE';

// SECTION_COLUMNS configuratie - bepaalt welke kolommen bij welke sectie horen
// Deze configuratie is nu volledig in de frontend, geen AppScript deploy nodig bij wijzigingen!
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

// SECTION_CONFIG - mapping tussen sectie keys en DOM element IDs
const SECTION_CONFIG = {
  notes: { type: 'note', contentId: 'notes-content' },
  boven: { listId: 'boven-suites', infoId: 'boven-info' },
  begane: { listId: 'begane-suites', infoId: 'begane-info' },
  kelder: { listId: 'kelder-suites', infoId: 'kelder-info' },
  audio: { listId: 'audio-suites', infoId: 'audio-info' },
  color: { listId: 'color-suites', infoId: 'color-info' },
  remote: { listId: 'remote-suites', infoId: 'remote-info' }
};

