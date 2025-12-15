## Postlounge Planning Scherm – GitHub Pages versie

Een fullscreen web‑dashboard voor de Postlounge planning, gebouwd voor weergave op een groot scherm en gevoed door een Google Sheet via Apps Script.

---

## Overzicht

- **2 volledige slides** met een vaste indeling:
  - **Slide 0**: Suites **boven** en **begane grond**.
  - **Slide 1**: Suites **beneden**, **Colorgrading**, **Audio** en **Remote Editors**.
- **Top‑row** met:
  - \"**Welkom**\" (Bould‑stijl)  
  - \"**bij**\" (italic)  
  - Postlounge **logo** (svg uit `fotos/`)  
  - Rechts de **Vandaag‑balk**: `Vandaag | <tekst uit notes‑kolom>` (fallback: `Geen bijzonderheden`).
- **WiFi + ON‑AIR blok** onderaan beide slides:
  - WiFi‑naam en wachtwoord.
  - QR‑code afbeelding (`pl-wifi.png`).
  - ON‑AIR knop die de stilte‑modus activeert.

---

## Belangrijkste features

### Slideshow & layout

- **Slides**:
  - Slide 0: `Suites - boven` links en `Suites - begane grond` rechts.
  - Slide 1: 2×2 grid met:
    - `Suites - beneden`
    - `Colorgrading - beneden`
    - `Audio - beneden`
    - `Remote Editors` (compact kaartje).
- **Navigatie**:
  - **Dots** onderaan voor handmatige slide‑selectie.
  - **Automatische wissel** via een timer in `script.js` (`SLIDE_INTERVAL`).
- **Left/Right side layout** in kaarten:
  - Links: suite‑namen (`left-list`).
  - Midden: dunne divider.
  - Rechts: status / info (`right-side`), uitgelijnd bij de linkerkant zodat rijen mooi onder elkaar staan.

### Data & logica

- **Bron**: Google Sheets tab (bijv. `2025`), uitgelezen via Apps Script (`code.gs`).
- **Notes → Vandaag‑balk**:
  - De notes‑kolom (`notes` in `SECTION_COLUMNS`) wordt weergegeven in `#vandaag-content`.
  - Als de notes‑cel leeg is, wordt automatisch `Geen bijzonderheden` getoond.
- **Remote Editors fallback**:
  - Als er geen remote‑data is, wordt in de Remote‑kaart de tekst `Vandaag geen remote editors` getoond (één regel, gecentreerd).
- **Caching & refresh**:
  - **LocalStorage cache** in `api.js` (korte TTL, ±30s).
  - **Automatische refresh** in `script.js` via `DATA_REFRESH_INTERVAL` (nu ±10 minuten).
  - **Handmatige refresh**: klik op het kleine logo linksonder in het scherm:
    - Cache wordt geleegd (`clearDashboardCache()`).
    - Data wordt opnieuw opgehaald (`loadAndUpdateDashboard(true)`).

### Stilte‑modus / ON‑AIR

- De ON‑AIR knop in het WiFi/ON‑AIR blok:
  - Zet de stilte‑modus aan/uit.
  - Past de tekst aan (ON‑AIR vs. OFF‑AIR).
  - Laat een **pulserende rode achtergrond** zien bij actieve stilte‑modus.

---

## Technische setup

### 1. Apps Script backend

1. Open [`https://script.google.com`](https://script.google.com).
2. Maak een **nieuw project** en plak de inhoud van `code.gs` uit deze map.
3. Vul bovenin `code.gs` de juiste spreadsheet‑ID en tabnaam in:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
   const TAB_NAME = '2025'; // of een andere tabnaam
   ```
4. Deploy als **Web App**:
   - Deploy → New deployment → type: Web app.
   - Execute as: Me.
   - Who has access: Anyone.
   - Kopieer de Web App URL.

### 2. Frontend configureren

1. Open `config.js`.
2. Zet de Web App URL in `APPSCRIPT_API_URL`:
   ```javascript
   const APPSCRIPT_API_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
   ```
3. Controleer dat `SECTION_COLUMNS` en `SECTION_CONFIG` overeenkomen met je Sheet‑indeling (boven, begane grond, beneden, audio, colorgrading, remote, notes).

### 3. Slideshow & refresh timers

In `script.js` staan bovenin de relevante instellingen:

```javascript
let SLIDE_INTERVAL = 60000;               // tijd tussen slides (ms)
const DATA_REFRESH_INTERVAL = 600 * 1000; // elke 10 minuten data verversen
```

- Wil je **geen automatische slide‑wissel**? Zet de aanroep van `startTimer()` in `initSlideshow()` uit (of geef `SLIDE_INTERVAL` een hoge waarde).

### 4. Fonts & styling

- Custom fonts (zoals **Bould**) worden gedefinieerd in `fonts.css`.
- Kleuren, spacing en typografie worden voornamelijk via CSS‑variabelen in `style.css` geregeld.
- De layout is geoptimaliseerd voor een **16:9 scherm** en heeft een aparte mobiele layout:
  - Op mobiel wordt het WiFi/ON‑AIR blok versimpeld; QR‑code en ON‑AIR button kunnen verborgen zijn.

---

## GitHub Pages deployment

1. Maak een GitHub repository aan (of gebruik een bestaande).
2. Zet de inhoud van de map `PL PLANNINGS SCHERM GITHUB PAGES/` in de root van de Pages‑branch (bijv. `main`).
3. In GitHub → Settings → Pages:
   - Source: de juiste branch.
   - Folder: `/` (root).
4. Wacht even; de site komt beschikbaar op  
   `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`.

---

## Bestanden in deze map

```text
PL PLANNINGS SCHERM GITHUB PAGES/
├── index.html    # HTML structuur, top‑row, slides en kaarten
├── style.css     # Hoofd CSS (grid, kaarten, WiFi/ON‑AIR, Remote, mobiel)
├── fonts.css     # @font-face definities (o.a. Bould)
├── config.js     # Mapping van Sheet‑kolommen naar secties (SECTION_COLUMNS / SECTION_CONFIG)
├── api.js        # Fetch + caching logica (localStorage)
├── render.js     # Data → DOM rendering (left-list, right-side, remote fallback, notes)
├── script.js     # Initialisatie, slideshow, timers, stilte‑modus, handmatige refresh
├── code.gs       # Apps Script backend (JSON endpoint voor de Sheet)
└── README.md     # Deze documentatie (GitHub Pages versie)
```

De **laadvolgorde** van scripts in `index.html` is belangrijk:

1. `config.js`
2. `api.js` (gebruikt config)
3. `render.js` (gebruikt config)
4. `script.js` (gebruikt alles)

---

## Troubleshooting (kort)

- **Geen data**:
  - Check of `APPSCRIPT_API_URL` klopt.
  - Open de Apps Script URL direct in je browser en controleer of je JSON terugkrijgt.
- **CORS / permissie‑errors**:
  - Controleer of de Web App deployment op \"Anyone\" staat.
- **Layout wijkt af**:
  - Check of `style.css` en `fonts.css` worden geladen (Developer Tools → Network).
  - Controleer of er geen oude CSS uit cache wordt gebruikt (hard refresh).

---

## Licentie

Voeg hier zelf de gewenste licentie‑informatie toe (bijv. intern gebruik binnen Postlounge). 
