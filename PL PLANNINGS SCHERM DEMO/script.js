  const SECTION_CONFIG = {
    notes: { type: 'note', contentId: 'notes-content' },
    boven: { listId: 'boven-suites', infoId: 'boven-info' },
    begane: { listId: 'begane-suites', infoId: 'begane-info' },
    kelder: { listId: 'kelder-suites', infoId: 'kelder-info' },
    audio: { listId: 'audio-suites', infoId: 'audio-info' },
    color: { listId: 'color-suites', infoId: 'color-info' },
    remote: { listId: 'remote-suites', infoId: 'remote-info' }
  };

const PLACEHOLDER_PAYLOAD = {
  rowNumber: 2,
  dateLabel: '01-01-2025',
  data: {
    notes: [{ value: 'Vandaag is het rustig, alle sets zijn open.' }],
    boven: [
      { label: 'SET 1 - Rector', value: 'Rector / 08:00 - 12:00' },
      { label: 'SET 2 - Tekenen', value: 'Tekenen / 08:00 - 20:00' },
      { label: 'SET 3 - Rekenen', value: 'Rekenen / 09:00 - 14:00' },
      { label: 'SET 4 - Nederlands', value: 'Nederlands / Beschikbaar' },
      { label: 'SET 5 - Laboratorium', value: 'Laboratorium / 12:00 - 22:00' },
      { label: 'SET 6 - Biologie', value: 'Biologie / 06:00 - 09:00' },
      { label: 'SET 7 - Geschiedenis', value: 'Geschiedenis / Beschikbaar' },
      { label: 'SET 8 - Bibliotheek', value: 'Bibliotheek / 14:00 - 21:00' }
    ],
    begane: [
      { label: 'SET 9 - Directie', value: 'Directie / 08:00 - 18:00' },
      { label: 'SET 10 - Apenkooi', value: 'Apenkooi / Beschikbaar' },
      { label: 'SET 11 - Ballenhok', value: 'Ballenhok / 10:00 - 16:00' },
      { label: 'SET 12 - Klimop', value: 'Klimop / 13:00 - 19:00' },
      { label: 'SET 13 - Gymzaal', value: 'Gymzaal / Beschikbaar' },
      { label: 'SET 14 - Conciergie', value: 'Conciergie / 09:00 - 17:00' }
    ],
    kelder: [
      { label: 'SET 15 - Brommerhok', value: 'Brommerhok / Beschikbaar' },
      { label: 'SET 16 - Fietsenhok', value: 'Fietsenhok / 11:00 - 18:00' },
      { label: 'Set 28 - Speelkwartier', value: 'Speelkwartier / 12:00 - 15:00' }
    ],
    audio: [
      { label: 'Gitaarles Protools', value: 'Gitaarles / 09:00 - 12:00' },
      { label: 'Zangles Voice-Over', value: 'Zangles / 14:00 - 18:00' },
      { label: 'Drumles Protools', value: 'Drumles / Beschikbaar' },
      { label: 'Trompetles Voice-Over', value: 'Trompetles / 16:00 - 20:00' }
    ],
    color: [
      { label: 'Toneel', value: 'Toneel / 08:00 - 11:00' },
      { label: 'Klein Theater', value: 'Klein Theater / 13:00 - 22:00' },
      { label: 'Drama', value: 'Drama / Beschikbaar' }
    ],
    remote: [
      { label: 'REMOTE HUISWERK 01', value: 'Huiswerk 01 / Online' },
      { label: 'REMOTE HUISWERK 02', value: 'Huiswerk 02 / Online' },
      { label: 'REMOTE HUISWERK 03', value: 'Huiswerk 03 / Beschikbaar' },
      { label: 'REMOTE HUISWERK 04', value: 'Huiswerk 04 / Beschikbaar' }
    ]
  }
};

  let activeRowNumber = null;
  let activeDateLabel = '';

window.addEventListener('DOMContentLoaded', () => {
  handleDashboardData(PLACEHOLDER_PAYLOAD);
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
