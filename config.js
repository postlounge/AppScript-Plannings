/**
 * Configuratie bestand
 * 
 * Dit bestand bevat alle configuratie instellingen voor de applicatie.
 * Wijzigingen hier hoeven niet gedeployed te worden naar AppScript.
 */

/**
 * AppScript Web App URL
 * 
 * Vervang deze URL met je eigen AppScript Web App URL na deploy.
 * Instructies: Zie README.md voor setup instructies.
 * 
 * @type {string}
 */
const APPSCRIPT_API_URL = 'https://script.google.com/macros/s/AKfycbzPMm1aJKDO3YY60RFV3-fes4vbELdOnjnucLgbTwffW8d17HngpfZ35EfGqdSLtQluqA/exec';

/**
 * SECTION_COLUMNS configuratie
 * 
 * Bepaalt welke spreadsheet kolommen bij welke sectie horen.
 * Deze configuratie staat volledig in de frontend - geen AppScript deploy nodig bij wijzigingen!
 * 
 * Structuur:
 * - key: sectie naam (boven, begane, kelder, etc.)
 * - column: spreadsheet kolom letter (A, B, AA, etc.)
 * - header: optionele header tekst uit spreadsheet
 * - label: optionele custom label (anders wordt header gebruikt)
 * 
 * @type {Object<string, Array<{column: string, header?: string, label?: string}>>}
 */
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
    { column: 'AA', header: 'Set 17 - Speelkwartier' }
  ],
  audio: [
    { column: 'AJ', header: 'Set 1 - Gitaarles', label: 'Gitaarles Protools' },
    { column: 'AK', header: 'Set 2 - Zangles (VO)', label: 'Zangles Voice-Over' },
    { column: 'AL', header: 'Set 3 - Drumles', label: 'Drumles Protools' },
    { column: 'AM', header: 'Set 4 - Trompetles (VO)', label: 'Trompetles Voice-Over' }
  ],
  color: [
    { column: 'AO', header: 'Set 1 -Toneel (Davinci)', label: 'Toneel' },
    { column: 'AP', header: 'Set 2 - Klein theater (Nucoda', label: 'Klein Theater' },
    { column: 'AQ', header: 'Set 3 - Drama (Davinci)', label: 'Drama' }
  ],
  remote: [
    { column: 'AE', header: 'REMOTE HUISWERK 01' },
    { column: 'AF', header: 'REMOTE HUISWERK 02' },
    { column: 'AG', header: 'REMOTE HUISWERK 03' },
    { column: 'AH', header: 'REMOTE HUISWERK 04' }
  ]
};

/**
 * SECTION_CONFIG - Mapping tussen sectie keys en DOM element IDs
 * 
 * Koppelt elke sectie aan de bijbehorende HTML elementen:
 * - listId: ID van de <ul> element voor suite namen (left-list)
 * - infoId: ID van de <div> element voor suite informatie (right-side)
 * - contentId: ID van het element voor notes content (alleen voor notes type)
 * - type: 'note' voor notes sectie, anders standaard suite sectie
 * 
 * @type {Object<string, {listId?: string, infoId?: string, contentId?: string, type?: string}>}
 */
const SECTION_CONFIG = {
  notes: { type: 'note', contentId: 'vandaag-content' },
  boven: { listId: 'boven-suites', infoId: 'boven-info' },
  begane: { listId: 'begane-suites', infoId: 'begane-info' },
  kelder: { listId: 'kelder-suites', infoId: 'kelder-info' },
  audio: { listId: 'audio-suites', infoId: 'audio-info' },
  color: { listId: 'color-suites', infoId: 'color-info' },
  remote: { listId: 'remote-suites', infoId: 'remote-info' }
};

