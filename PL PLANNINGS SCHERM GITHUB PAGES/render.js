// Rendering functies - verantwoordelijk voor het weergeven van data in de UI

// State variabelen
let activeRowNumber = null;
let activeDateLabel = '';

// Render dashboard met data
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

// Populeert een sectie met entries
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

// Populeert de notitie sectie
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

// Update state en render dashboard
function handleDashboardData(payload) {
  activeRowNumber = payload && payload.rowNumber ? payload.rowNumber : null;
  activeDateLabel = payload && payload.dateLabel ? payload.dateLabel : '';
  renderDashboard(payload && payload.data ? payload.data : {});
}

