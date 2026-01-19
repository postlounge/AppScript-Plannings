/**
 * Rendering functies
 * 
 * Verantwoordelijk voor het weergeven van data in de UI.
 */

/**
 * State variabelen voor huidige context
 */
let activeRowNumber = null; // Huidige rij nummer
let activeDateLabel = '';   // Huidige datum label

/**
 * Render dashboard met data
 * 
 * Loopt door alle secties in SECTION_CONFIG en rendert de bijbehorende data.
 * 
 * @param {Object<string, Array<{label: string, value: string}>>} data - 
 *   Gestructureerde data object met secties als keys
 */
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

/**
 * Populeert een sectie met entries
 * 
 * Vult een specifieke sectie (card) met data. Toont suite namen in left-list
 * en suite informatie in right-side, gescheiden door een divider.
 * 
 * @param {Object} config - Sectie configuratie met listId en infoId
 * @param {Array<{label: string, value: string}>} entries - Array van suite entries
 */
function populateSection(config, entries) {
  const leftList = document.getElementById(config.listId);
  const rightSide = document.getElementById(config.infoId);
  const divider = leftList && leftList.nextElementSibling && leftList.nextElementSibling.classList.contains('divider')
    ? leftList.nextElementSibling
    : null;

  if (!rightSide) return;

  const isRemote = config.infoId === 'remote-info';
  const hasRemoteContent = isRemote
    ? entries.some(e => e && e.value && e.value.trim())
    : false;

  rightSide.innerHTML = '';
  if (leftList) {
    leftList.innerHTML = '';
    leftList.classList.remove('hidden');
  }
  if (divider) {
    divider.classList.remove('hidden');
  }

  if (!entries.length || (isRemote && !hasRemoteContent)) {
    if (isRemote) {
      // Speciaal bericht voor remote tab als er geen data is
      if (leftList) {
        leftList.innerHTML = '';
        leftList.classList.add('hidden');
      }
      if (divider) {
        divider.classList.add('hidden');
      }
      rightSide.innerHTML = '<span class="remote-empty">Vandaag geen remote editors</span>';
    } else {
      const scope = activeRowNumber
        ? `rij ${activeRowNumber}`
        : activeDateLabel
        ? `datum ${activeDateLabel}`
        : 'deze dag';

      if (leftList) {
        leftList.textContent = 'Geen data';
      }
      rightSide.textContent = `Geen data gevonden voor ${scope}.`;
    }
    return;
  }

  // Vul left-list met labels
  if (leftList) {
    entries.forEach(item => {
      const listItem = document.createElement('li');
      listItem.className = 'suite-item';
      listItem.textContent = item.label || '-';
      leftList.appendChild(listItem);
    });
  }

  // Vul right-side met values
  const pairContainer = document.createElement('div');
  pairContainer.className = 'pair-list';

  entries.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'pair-row';
    row.dataset.rowIndex = index; // Voor synchronisatie met left-list

    const value = document.createElement('span');
    value.className = 'pair-value';
    
    // Voor remote sectie: toon niets als leeg, anders toon waarde
    // Voor andere secties: toon "Beschikbaar" als leeg
    const isRemote = config.infoId === 'remote-info';
    if (item.value && item.value.trim()) {
      // Verwijder alles na het leesteken "-"
      let displayValue = item.value.trim();
      const dashIndex = displayValue.indexOf('-');
      if (dashIndex !== -1) {
        displayValue = displayValue.substring(0, dashIndex).trim();
      }
      value.textContent = displayValue;
      value.classList.add('booked');
    } else if (!isRemote) {
      value.textContent = 'Beschikbaar';
    } else {
      // Remote sectie: lege cel = niets tonen
      value.textContent = '';
    }
    
    row.appendChild(value);
    pairContainer.appendChild(row);
  });

  rightSide.appendChild(pairContainer);

  // Synchroniseer hoogtes van left-list items en pair-row items
  if (leftList && rightSide) {
    synchronizeRowHeights(leftList, pairContainer);
  }
}

/**
 * Synchroniseert de hoogtes van left-list items en pair-row items
 * Zorgt ervoor dat items op dezelfde rij exact dezelfde hoogte hebben
 * 
 * @param {HTMLElement} leftList - De left-list container
 * @param {HTMLElement} pairList - De pair-list container
 */
function synchronizeRowHeights(leftList, pairList) {
  const leftItems = leftList.querySelectorAll('.suite-item');
  const rightItems = pairList.querySelectorAll('.pair-row');
  
  // Gebruik requestAnimationFrame om te wachten tot de browser klaar is met renderen
  requestAnimationFrame(() => {
    // Reset alle hoogtes eerst
    leftItems.forEach(item => item.style.height = '');
    rightItems.forEach(item => item.style.height = '');
    
    // Zet voor elk paar de hoogste hoogte
    const maxLength = Math.max(leftItems.length, rightItems.length);
    for (let i = 0; i < maxLength; i++) {
      const leftItem = leftItems[i];
      const rightItem = rightItems[i];
      
      if (leftItem && rightItem) {
        const leftHeight = leftItem.offsetHeight;
        const rightHeight = rightItem.offsetHeight;
        const maxHeight = Math.max(leftHeight, rightHeight);
        
        leftItem.style.height = maxHeight + 'px';
        rightItem.style.height = maxHeight + 'px';
      }
    }
  });
}

/**
 * Populeert de notes card met notities
 * 
 * Vult de notes-card met notitie tekst uit de spreadsheet.
 * 
 * @param {Object} config - Notes configuratie met contentId
 * @param {Array<{label: string, value: string}>} entries - Array met notes entries
 */
function populateNote(config, entries) {
  const container = document.getElementById(config.contentId);
  if (!container) return;

  // Als er notes zijn, toon de eerste note. Anders toon "Geen bijzonderheden"
  const text = entries.length && entries[0].value && entries[0].value.trim()
    ? entries[0].value.trim()
    : 'Geen bijzonderheden';

  container.textContent = text;
}

/**
 * Update state en render dashboard
 * 
 * Verwerkt de payload van de API en rendert het dashboard met de data.
 * 
 * @param {Object} payload - API response met {data, rowNumber, dateLabel}
 */
function handleDashboardData(payload) {
  activeRowNumber = payload && payload.rowNumber ? payload.rowNumber : null;
  activeDateLabel = payload && payload.dateLabel ? payload.dateLabel : '';
  renderDashboard(payload && payload.data ? payload.data : {});
}

