## Structure – Postlounge Planning Scherm (GitHub Pages)

Korte dev-cheatsheet: welk deel van het scherm komt uit welke file.

---

## 1. Top row

- **Welkom / bij / logo (linksboven)**
  - **HTML**: `index.html`
    - `div.top-row > div.welkom-text`
    - `span.welkom-word`, `span.bij-word`, `img.top-logo`
  - **CSS**: `style.css`
    - `.top-row`, `.welkom-text`, `.welkom-word`, `.bij-word`, `.top-logo`

- **Vandaag-balk (rechtsboven)**
  - **HTML**: `index.html`
    - `div.vandaag-balk`
    - `span.vandaag-label`, `span.vandaag-separator`, `span.vandaag-content#vandaag-content`
  - **CSS**: `style.css`
    - `.vandaag-balk`, `.vandaag-label`, `.vandaag-separator`, `.vandaag-content`
  - **Data (notes → tekst)**:
    - `config.js`: `SECTION_CONFIG.notes` met `type: 'note'`, `contentId: 'vandaag-content'`
    - `render.js`: `populateNote()` + `renderDashboard()`

---

## 2. Slides & navigatie

- **Slideshow container + slides**
  - **HTML**: `index.html`
    - `div.slideshow-container`
    - `div.slide[data-slide="0"] > div.page`
    - `div.slide[data-slide="1"] > div.page`
  - **CSS**: `style.css`
    - `.slideshow-container`, `.slide`, `.slide.active`
    - `.slide[data-slide="0"] .page` (grid Boven / Begane)
    - `.slide[data-slide="1"] .page`, `.right-column` (2×2 grid)

- **Dots + klein logo onderaan**
  - **HTML**: `index.html`
    - `div.slideshow-dots`
    - `div.dots-container > span.dot[data-slide="0|1"]`
    - `img.dots-logo#refresh-logo`
  - **CSS**: `style.css`
    - `.slideshow-dots`, `.dots-container`, `.dot`, `.dot.active`, `.dots-logo`
  - **JS**:
    - `script.js`: `initSlideshow()` (handmatige + automatische slide-wissel)
    - `script.js`: `window.load` listener:
      - click-handler op `#refresh-logo` → `clearDashboardCache()` + `loadAndUpdateDashboard(true)`

---

## 3. Slide 0 – Suites boven & begane grond + WiFi/ON-AIR

- **Suites - boven (linkerkaart)**
  - **HTML**: `index.html`
    - `div.card-wrapper.boven-card`
    - `section.card > div.card-content`
      - `ul.left-list#set-content#boven-suites`
      - `div.divider`
      - `div.right-side#boven-info`
  - **CSS**: `style.css`
    - `.slide[data-slide="0"] .page`
    - `.card-wrapper`, `.card`, `.card-content`
    - `.left-list`, `.suite-item`, `.divider`, `.right-side`
    - `.pair-list`, `.pair-row`, `.pair-value`
  - **Data**:
    - `config.js`: `SECTION_COLUMNS.boven` + `SECTION_CONFIG.boven`
    - `utils.js`: `transformData()` (bouwt data.boven)
    - `render.js`: `renderDashboard()` → `populateSection()` met `listId='boven-suites'`, `infoId='boven-info'`

- **Suites - begane grond (rechterkaart)**
  - **HTML**: `index.html`
    - `div.card-wrapper.begane-card`
    - `ul#begane-suites`, `div#begane-info`
  - **Data**:
    - `config.js`: `SECTION_COLUMNS.begane` + `SECTION_CONFIG.begane`
    - `render.js`: `populateSection()` met `listId='begane-suites'`, `infoId='begane-info'`

- **WiFi + ON-AIR onder Begane Grond**
  - **HTML**: `index.html`
    - `div.bottom-info-grid`
      - `div.wifi-info-section`
        - `div.wifi-qr-code > img.qr-image`
        - `div.wifi-text > div.wifi-line` (naam/wachtwoord)
      - `div.on-air-section > button#silence-toggle.on-air-button`
  - **CSS**: `style.css`
    - `.bottom-info-grid`, `.wifi-info-section`, `.wifi-qr-code`, `.qr-image`
    - `.wifi-text`, `.wifi-line`, `.on-air-section`, `.on-air-button`
    - `body.silence-on .on-air-button`, `@keyframes pulse-red`
  - **JS (stilte-modus)**:
    - `script.js`: `DOMContentLoaded` handler:
      - `setSilenceState(on)` (zet `body.silence-on` en knoptekst “ON-AIR”/“Opnames”)
      - click-handlers op `#silence-toggle` en `#silence-toggle-slide1`

---

## 4. Slide 1 – Suites beneden, Colorgrading, Audio, Remote

- **Suites - beneden**
  - **HTML**: `index.html`
    - Eerste `card-wrapper` in `.right-column`
    - `section#kelder-card.card.small`
      - `ul#kelder-suites`, `div#kelder-info`
  - **Data**:
    - `config.js`: `SECTION_COLUMNS.kelder` + `SECTION_CONFIG.kelder`

- **Colorgrading - beneden**
  - **HTML**: `index.html`
    - `section#color-card.card.small`
      - `ul#color-suites`, `div#color-info`
  - **Data**:
    - `config.js`: `SECTION_COLUMNS.color` + `SECTION_CONFIG.color`

- **Audio - beneden**
  - **HTML**: `index.html`
    - `section#audio-card.card.small`
      - `ul#audio-suites`, `div#audio-info`
  - **CSS extra**: `style.css`
    - `#audio-card .card-content { grid-template-columns: 190px 1px 1fr; }`
  - **Data**:
    - `config.js`: `SECTION_COLUMNS.audio` + `SECTION_CONFIG.audio`

- **Remote Editors (compact blok)**
  - **HTML**: `index.html`
    - `section#remote-card.card.small > div.card-content#remote-info`
  - **CSS**: `style.css`
    - `#remote-card`, `#remote-card .card-content`
    - `.remote-empty`, `#remote-card .pair-list`, `#remote-card .pair-value`
  - **Data + leeg-tekst**:
    - `config.js`: `SECTION_COLUMNS.remote` + `SECTION_CONFIG.remote`
    - `render.js`: `populateSection()`:
      - herkent `config.infoId === 'remote-info'` als remote
      - toont `Vandaag geen remote editors` in `.remote-empty` als er geen remote data is

- **WiFi + ON-AIR onder 2×2 grid**
  - **HTML**: `index.html`
    - `div.bottom-info-grid.slide1-bottom` (zelfde structuur als op slide 0)
  - **CSS**: `style.css`
    - `.slide1-bottom` + dezelfde WiFi/ON-AIR classes als slide 0

---

## 5. Dataflow & refresh (globaal)

- **Kolom-mapping & secties**
  - `config.js`:
    - `SECTION_COLUMNS` – welke sheet-kolom hoort bij welke sectie (boven, begane, beneden, audio, color, remote, notes).
    - `SECTION_CONFIG` – welke sectie rendert in welke HTML-elementen (`listId`, `infoId`, `contentId`, `type`).

- **Data ophalen + caching**
  - `api.js`:
    - `fetchDashboardData(path, rowNumber)` – haalt JSON van de Apps Script Web App.
    - `CACHE_DURATION` + `getCachedData()` / `setCachedData()` – localStorage cache (~30s).

- **Ruwe data → UI-data**
  - `utils.js`:
    - `columnLetterToIndex()` – kolomletter → index.
    - `extractSuiteNaam()` – haalt naam uit header (“SET 1 - Rector” → “Rector”).
    - `transformData(headers, rowData)` – bouwt `{ boven: [...], begane: [...], ... }`.

- **UI renderen**
  - `render.js`:
    - `renderDashboard(data)` – loopt over `SECTION_CONFIG`.
    - `populateSection(config, entries)` – vult left-list/right-side.
    - `populateNote(config, entries)` – vult Vandaag-balk; fallback “Geen bijzonderheden”.
    - `handleDashboardData(payload)` – bewaart `activeRowNumber`/`activeDateLabel` en roept `renderDashboard`.

- **Initialisatie, timers & slideshow**
  - `script.js`:
    - `DATA_REFRESH_INTERVAL` – hoe vaak data opnieuw wordt opgehaald (nu 10 min).
    - `loadAndUpdateDashboard(showLoader)` – haalt data + roept `handleDashboardData`.
    - `window.load` listener – eerste load, automatische refresh timer, click op `#refresh-logo`.
    - `clearDashboardCache()` – wist alle `dashboard_*` keys uit localStorage.
    - `initSlideshow()` – regelt slides/dots/timer.

Dit bestand is puur bedoeld als navigatiehulp: als je iets in de UI ziet, kun je hier snel zien in welke files je moet zijn om het gedrag of de styling aan te passen.


