// Configuratie: Vervang dit met je AppScript Web App URL
// Na het deployen van je AppScript, kopieer de Web App URL hier
const APPSCRIPT_API_URL = 'YOUR_APPSCRIPT_WEB_APP_URL_HERE';

const SECTION_CONFIG = {
  notes: { type: 'note', contentId: 'notes-content' },
  boven: { listId: 'boven-suites', infoId: 'boven-info' },
  begane: { listId: 'begane-suites', infoId: 'begane-info' },
  kelder: { listId: 'kelder-suites', infoId: 'kelder-info' },
  audio: { listId: 'audio-suites', infoId: 'audio-info' },
  color: { listId: 'color-suites', infoId: 'color-info' },
  remote: { listId: 'remote-suites', infoId: 'remote-info' }
};

let activeRowNumber = null;
let activeDateLabel = '';

// Functie om data op te halen van AppScript API
async function fetchDashboardData(path = 'today', rowNumber = null) {
  if (!APPSCRIPT_API_URL || APPSCRIPT_API_URL === 'YOUR_APPSCRIPT_WEB_APP_URL_HERE') {
    console.error('AppScript API URL is niet geconfigureerd. Zie script.js voor instructies.');
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
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fout bij ophalen van data:', error);
    return null;
  }
}

window.addEventListener('load', async () => {
  const payload = await fetchDashboardData('today');
  if (payload) {
    handleDashboardData(payload);
  } else {
    // Fallback: toon foutmelding
    const errorMsg = 'Kon geen data ophalen. Controleer de AppScript API configuratie.';
    console.error(errorMsg);
    document.body.innerHTML = `<div style="color: white; padding: 20px; text-align: center;">${errorMsg}</div>`;
  }
});

function handleDashboardData(payload) {
  activeRowNumber = payload && payload.rowNumber ? payload.rowNumber : null;
  activeDateLabel = payload && payload.dateLabel ? payload.dateLabel : '';
  renderDashboard(payload && payload.data ? payload.data : {});
}

function renderDashboard(data) {
  Object.entries(SECTION_CONFIG).forEach(([key, config]) => {
    const sectionEntries = data && data[key] ? data[key] : [];
    if (config.type === 'note') {
      populateNote(config, sectionEntries);
    } else {
      populateSection(config, sectionEntries);
    }
  });
}

function populateSection(config, entries) {
  const leftList = document.getElementById(config.listId);
  const rightSide = document.getElementById(config.infoId);
  const divider = leftList && leftList.nextElementSibling && leftList.nextElementSibling.classList.contains('divider')
    ? leftList.nextElementSibling
    : null;

  if (!rightSide) return;

  rightSide.innerHTML = '';
  if (leftList) {
    leftList.innerHTML = '';
    leftList.classList.add('hidden');
  }
  if (divider) {
    divider.classList.add('hidden');
  }

  if (!entries.length) {
    const scope = activeRowNumber
      ? `rij ${activeRowNumber}`
      : activeDateLabel
      ? `datum ${activeDateLabel}`
      : 'deze dag';

    rightSide.textContent = `Geen data gevonden voor ${scope}.`;
    return;
  }

  const pairContainer = document.createElement('div');
  pairContainer.className = 'pair-list';

  entries.forEach(item => {
    const row = document.createElement('div');
    row.className = 'pair-row';

    const label = document.createElement('span');
    label.className = 'pair-label';
    label.textContent = item.label || '-';

    const value = document.createElement('span');
    value.className = 'pair-value';
    value.textContent = item.value && item.value.trim() ? item.value : 'Beschikbaar';

    // Voeg 'booked' class toe als de waarde NIET 'Beschikbaar' is
    if (value.textContent !== 'Beschikbaar') {
      value.classList.add('booked');
    }
    row.appendChild(label);
    row.appendChild(value);
    pairContainer.appendChild(row);
  });

  rightSide.appendChild(pairContainer);
}

function populateNote(config, entries) {
  const container = document.getElementById(config.contentId);
  if (!container) return;

  const text = entries.length && entries[0].value
    ? entries[0].value
    : 'export aanvragen na 16:00 worden de volgende dag in behandeling genomen';

  // Bewaar originele note tekst zodat we kunnen terugzetten na stilte-modus
  window.__originalNoteText = text;
  container.textContent = document.body.classList.contains('silence-on')
    ? 'Stilte wegens opnames'
    : text;
}

// Stilte-modus toggle: pulserende rode achtergrond + note-override
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('silence-toggle');
  const notesEl = document.getElementById('notes-content');
  let originalNote = window.__originalNoteText || '';

  const setSilenceState = (on) => {
    document.body.classList.toggle('silence-on', on);
    if (notesEl) {
      if (!originalNote && typeof window.__originalNoteText === 'string') {
        originalNote = window.__originalNoteText;
      }
      notesEl.textContent = on ? 'Stilte wegens opnames' : (originalNote || notesEl.textContent);
    }
    if (toggleBtn) toggleBtn.textContent = on ? 'Stilte-modus: ON' : 'Stilte-modus: OFF';
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const nextState = !document.body.classList.contains('silence-on');
      setSilenceState(nextState);
    });
  }

  setSilenceState(false);
});

