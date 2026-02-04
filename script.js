/**
 * Main entry point
 * 
 * Initialisatie en event handlers voor de applicatie.
 */

/**
 * Toont loading indicator
 * 
 * Maakt en toont een loading indicator tijdens data ophalen.
 */
function showLoading() {
  const loadingEl = document.createElement('div');
  loadingEl.id = 'loading-indicator';
  loadingEl.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px 40px;
    border-radius: 10px;
    z-index: 9999;
    font-family: 'Open Sans', sans-serif;
    font-size: 18px;
  `;
  loadingEl.textContent = 'Planning Data Laden...';
  document.body.appendChild(loadingEl);
}

function hideLoading() {
  const loadingEl = document.getElementById('loading-indicator');
  if (loadingEl) {
    loadingEl.remove();
  }
}

/**
 * Data refresh interval configuratie
 * 
 * @constant {number}
 * @default 60000 (1 minuut in milliseconden)
 * Interval voor automatische data refresh van spreadsheet
 */
const DATA_REFRESH_INTERVAL = 600 * 1000; // 10 minuten in milliseconden

/**
 * Verwijder dashboard cache (localStorage)
 * 
 * Wordt gebruikt bij handmatige refresh via het kleine logo.
 */
function clearDashboardCache() {
  Object.keys(localStorage)
    .filter((key) => key.startsWith('dashboard_'))
    .forEach((key) => localStorage.removeItem(key));
}

/**
 * Laad en update dashboard data
 * 
 * Haalt data op en rendert het dashboard. Wordt gebruikt bij initialisatie
 * en voor periodieke updates.
 * 
 * @param {boolean} showLoader - Of de loading indicator moet worden getoond
 */
async function loadAndUpdateDashboard(showLoader = false) {
  if (showLoader) {
    showLoading();
  }
  try {
    const payload = await fetchDashboardData('today');
    if (payload) {
      handleDashboardData(payload);
    } else {
      // Fallback: toon foutmelding alleen bij eerste load
      if (showLoader) {
        const errorMsg = 'Kon geen data ophalen. Controleer de AppScript API configuratie in config.js en zorg dat de Web App correct is gedeployed.';
        console.error(errorMsg);
        console.error('Debug info: Check browser console (F12) voor meer details.');
        document.body.innerHTML = `<div style="color: #ff6b6b; padding: 20px; text-align: center; font-family: Arial; line-height: 1.6;"><strong>❌ Fout bij laden:</strong><br>${errorMsg}<br><br><small style="color: #999;">Raadpleeg de browser console (F12) voor meer details.</small></div>`;
      }
    }
  } finally {
    if (showLoader) {
      hideLoading();
    }
  }
}

/**
 * Initialiseer applicatie bij laden
 * 
 * Haalt data op bij page load en rendert het dashboard.
 * Start ook automatische refresh interval.
 */
let dataRefreshTimer = null;

window.addEventListener('load', async () => {
  // Laad data bij eerste load
  await loadAndUpdateDashboard(true);
  
  // Handmatige refresh via kleine logo linksonder
  const refreshLogo = document.getElementById('refresh-logo');
  if (refreshLogo) {
    refreshLogo.style.cursor = 'pointer';
    refreshLogo.addEventListener('click', async () => {
      clearDashboardCache();
      await loadAndUpdateDashboard(true);
    });
  }
  
  // Start automatische refresh interval
  dataRefreshTimer = setInterval(() => {
    console.log('Automatische data refresh...');
    loadAndUpdateDashboard(false); // Geen loader bij automatische refresh
  }, DATA_REFRESH_INTERVAL);
});

/**
 * Stilte-modus toggle
 * 
 * Initialiseert de stilte-modus functionaliteit. Bij activatie krijgt
 * de body een pulserende rode achtergrond animatie.
 */
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('silence-toggle');
  const toggleBtnSlide1 = document.getElementById('silence-toggle-slide1');

  const setSilenceState = (on) => {
    document.body.classList.toggle('silence-on', on);
    const text = on ? 'ON-AIR' : 'Opnames';
    if (toggleBtn) toggleBtn.textContent = text;
    if (toggleBtnSlide1) toggleBtnSlide1.textContent = text;
  };

  const handleToggle = () => {
    const nextState = !document.body.classList.contains('silence-on');
    setSilenceState(nextState);
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', handleToggle);
  }
  if (toggleBtnSlide1) {
    toggleBtnSlide1.addEventListener('click', handleToggle);
  }

  setSilenceState(false);

  // Initialiseer slideshow navigatie
  initSlideshow();
});

/**
 * Slideshow functionaliteit
 * 
 * Beheert de slideshow navigatie met automatische wisseling (timer)
 * en handmatige navigatie via dots. Ondersteunt meerdere slides.
 * 
 * Features:
 * - Automatische slide wisseling (timer, nu tijdelijk uitgeschakeld)
 * - Handmatige navigatie via dots
 * - Timer reset bij handmatige navigatie
 */
function initSlideshow() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;      // Huidige slide index
  let slideTimer = null;     // Timer referentie voor automatische wisseling
  let SLIDE_INTERVAL = 60000; // 1 minuut tussen slides

  /**
   * Toont een specifieke slide
   * 
   * Verbergt alle slides en toont alleen de slide met de gegeven index.
   * Update ook de actieve dot indicator.
   * 
   * @param {number} index - Index van de slide om te tonen (0-based)
   */
  function showSlide(index) {
    // Verberg alle slides
    slides.forEach((slide) => {
      slide.classList.remove('active');
    });

    // Verwijder active class van alle dots
    dots.forEach((dot) => {
      dot.classList.remove('active');
    });

    // Toon geselecteerde slide
    if (slides[index]) {
      slides[index].classList.add('active');
    }

    // Markeer corresponderende dot als actief
    if (dots[index]) {
      dots[index].classList.add('active');
    }

    // Toon de juiste WiFi-balk onderaan voor de actieve slide
    const bottomGrids = document.querySelectorAll('.bottom-info-grid[data-slide]');
    bottomGrids.forEach((grid) => {
      const gridSlide = grid.getAttribute('data-slide');
      grid.style.display = gridSlide === String(index) ? 'flex' : 'none';
    });

    // Toon de juiste Opnames-knop voor de actieve slide
    const onAirButtons = document.querySelectorAll('.on-air-button[data-slide]');
    onAirButtons.forEach((btn) => {
      const btnSlide = btn.getAttribute('data-slide');
      btn.style.display = btnSlide === String(index) ? 'inline-flex' : 'none';
    });

    currentSlide = index;
  }

  /**
   * Gaat naar de volgende slide
   * 
   * Wisselt cyclisch naar de volgende slide (gaat terug naar 0 na laatste slide).
   */
  function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }

  /**
   * Start de automatische slide timer
   * 
   * Start een interval timer die automatisch naar de volgende slide wisselt.
   * Stopt eerst een bestaande timer als die er is.
   */
  function startTimer() {
    // Stop bestaande timer als die er is
    if (slideTimer) {
      clearInterval(slideTimer);
    }
    // Start nieuwe timer
    slideTimer = setInterval(nextSlide, SLIDE_INTERVAL);
  }

  /**
   * Stopt de automatische slide timer
   * 
   * Stopt en reset de timer voor automatische slide wisseling.
   */
  function stopTimer() {
    if (slideTimer) {
      clearInterval(slideTimer);
      slideTimer = null;
    }
  }

  // Event listeners voor dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      // Reset timer bij handmatige navigatie
      startTimer();
    });
  });

  // Initialiseer eerste slide
  showSlide(0);
  
  // Start automatische slidewisseling
  // Tijdelijk uitgeschakeld voor aanpassingen
  // startTimer();

}

