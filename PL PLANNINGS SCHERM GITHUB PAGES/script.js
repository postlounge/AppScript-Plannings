// Main entry point - initialisatie en event handlers

// Initialiseer applicatie bij laden
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
