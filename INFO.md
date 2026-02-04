# Info – Postlounge Planning Scherm

Overzicht van waar alles staat, waar de hosting zit en waar je de belangrijkste punten aanpast.

---

## Wat is dit project?

Fullscreen web-dashboard voor de Postlounge planning. Data komt uit een **Google Sheet** via **Apps Script**; de frontend draait als statische site (bijv. **GitHub Pages**). Geschikt voor weergave op een groot scherm.

---

## Waar staat wat?

### Code & repository

- **Repository**: `AppScript-Plannings` (GitHub)
- **Bestanden in de root** van de repo:
  - `index.html` – HTML, top-row, slides, kaarten
  - `style.css` – hoofd-CSS (grid, kaarten, WiFi/ON-AIR, mobiel)
  - `fonts.css` – @font-face (o.a. Bould, AlmarenaNeue)
  - `config.js` – Sheet-kolommen en API-URL
  - `api.js` – fetch + localStorage-cache
  - `render.js` – data → DOM (left-list, right-side, notes)
  - `script.js` – init, slideshow, timers, stilte-modus, refresh
  - `utils.js` – kolom-index, suite-naam, transformData
  - `code.gs` – Apps Script backend (deploy apart in Google)

### Hosting

| Onderdeel | Waar het staat |
|-----------|----------------|
| **Frontend (website)** | **GitHub Pages** – na deploy: `https://<USERNAME>.github.io/AppScript-Plannings/` (Settings → Pages → branch + root) |
| **Backend (data)** | **Google Apps Script** – Web App deploy op https://script.google.com; de URL komt in `config.js` |

### Data-bron

- **Google Sheet**: ID en tabnaam staan in **`code.gs`** (niet in de frontend).
- De Web App-URL van Apps Script staat in **`config.js`** (`APPSCRIPT_API_URL`).

---

## Waar pas je wat aan?

### 1. Data-bron (Google Sheet + tab)

**Bestand:** `code.gs` (bovenaan)

```javascript
const TAB_NAME = '2026';                    // naam van de Sheet-tab
const SPREADSHEET_ID = '1vi902Bu5j1mC...'; // ID uit de Sheet-URL
```

- Na wijziging: in Apps Script opnieuw **Deploy → Manage deployments → Edit → New version** (of nieuwe deploy), zodat de Web App de nieuwe Sheet/tab gebruikt.

---

### 2. Frontend → backend (API-URL)

**Bestand:** `config.js`

```javascript
const APPSCRIPT_API_URL = 'https://script.google.com/macros/s/.../exec';
```

- Vul hier de **Web App URL** in na deploy in Apps Script (Deploy → New deployment → Web app → kopieer URL).
- Zonder juiste URL krijg je geen data.

---

### 3. Welke kolommen uit de Sheet waar komen

**Bestand:** `config.js`

- **`SECTION_COLUMNS`** – welke kolommen (A, B, C, …) bij welke sectie horen (notes, boven, begane, kelder, audio, color, remote). Hier wijzig je kolomletters en headers als je Sheet-layout verandert.
- **`SECTION_CONFIG`** – koppeling sectie ↔ DOM (welke `listId` / `infoId` / `contentId`). Meestal alleen aanpassen als je HTML-element-IDs verandert.

---

### 4. Slideshow: interval en automatische wissel

**Bestand:** `script.js`

- **Slide-interval**: in `initSlideshow()` staat o.a.  
  `let SLIDE_INTERVAL = 60000;` (ms, nu 1 minuut).
- **Automatische wissel**: regel met `startTimer()` – staat nu **uitgecommentarieerd** (rond regel 256). Aanzetten = automatisch door slides wisselen.

---

### 5. Data-refresh (hoe vaak opnieuw ophalen)

**Bestand:** `script.js` (bovenaan)

```javascript
const DATA_REFRESH_INTERVAL = 600 * 1000; // 10 minuten
```

**Bestand:** `api.js` (bovenaan)

```javascript
const CACHE_DURATION = 30 * 1000; // 30 seconden cache
```

- `DATA_REFRESH_INTERVAL`: hoe vaak de frontend opnieuw data van de API vraagt.
- `CACHE_DURATION`: hoe lang dezelfde request uit localStorage wordt hergebruikt.

---

### 6. Tekst en logo’s in de UI

**Bestand:** `index.html`

- **Welkom / bij / logo**: `.welkom-word`, `.bij-word`, `img.top-logo` (logo: `fotos/Postlounge-Logo-svg-sized.svg`).
- **Vandaag-balk**: `#vandaag-content` (tekst komt uit de Sheet; fallback “Geen bijzonderheden” staat in `render.js`).
- **WiFi-naam en -wachtwoord**: in `.wifi-text` de twee `.wifi-line` regels (nu o.a. “WiFi | De School” en “WW | …”).
- **QR-code afbeelding**: `img.qr-image` met `src` naar bijv. `fotos/pl-wifi.png`.
- **ON-AIR knop**: tekst “ON AIR” in de button; stilte-logica in `script.js`.

**Let op:** Bij GitHub Pages zijn paden vaak relatief. Logo’s/foto’s: relatief t.o.v. site-root, bijv. `fotos/pl-wifi.png` of `/AppScript-Plannings/fotos/...` afhankelijk van je base URL.

---

### 7. Kleuren, fonts en layout

**Bestand:** `style.css`

- CSS-variabelen voor kleuren, spacing, typografie.
- Layout 16:9, mobiele breakpoints en WiFi/ON-AIR-blok.

**Bestand:** `fonts.css`

- @font-face voor Bould, AlmarenaNeue (fonts in map `fonts/`).

---

### 8. Fallback-teksten (geen data)

**Bestand:** `render.js`

- Notes leeg → “Geen bijzonderheden” (Vandaag-balk).
- Geen remote-editors → “Vandaag geen remote editors” in de remote-kaart.

---

## Snel overzicht: “waar wijzig ik X?”

| Wat wijzigen | Bestand |
|--------------|---------|
| Sheet-ID of tabnaam | `code.gs` |
| Web App URL (na deploy) | `config.js` |
| Kolommen / secties uit Sheet | `config.js` (SECTION_COLUMNS, SECTION_CONFIG) |
| Slide-interval / auto-slides | `script.js` (initSlideshow, startTimer) |
| Interval data-refresh | `script.js` (DATA_REFRESH_INTERVAL) |
| Cache-duur API | `api.js` (CACHE_DURATION) |
| Welkom, logo, WiFi-tekst, QR, ON-AIR | `index.html` (+ evt. `style.css`) |
| Kleuren, layout, fonts | `style.css`, `fonts.css` |
| Fallback-teksten (geen data) | `render.js` |

---

## Hosting nog eens in het kort

1. **Website**: GitHub repo → Settings → Pages → branch (bijv. `main`) → root → save. URL: `https://<username>.github.io/AppScript-Plannings/`.
2. **Data**: Google Apps Script-project met `code.gs` → Deploy → Web app → Execute as: Me, Who has access: Anyone → URL in `config.js` zetten.

Voor meer detail en troubleshooting: zie **README.md** en **STRUCTURE.md**.
