# Planning Scherm - Post Lounge

Dashboard applicatie voor het weergeven van suite planningen en beschikbaarheid.

## Project Structuur

Dit project bevat twee versies:

### 1. AppScript Versie (`PL PLANNINGS SCHERM APPSCRIPT VERSIE/`)

De productie versie die draait als Google Apps Script web app en data ophaalt uit Google Sheets.

**Bestanden:**
- `code.gs` - Apps Script backend code voor data ophalen uit Google Sheets
- `index.html` - Hoofd HTML template
- `script.html` - JavaScript code voor de frontend
- `style.html` - CSS styling
- `fonts.html` - Font definities

**Setup instructies:**
1. Open Google Apps Script (script.google.com)
2. Maak een nieuw project aan
3. Kopieer de inhoud van `code.gs` naar Code.gs
4. Maak HTML bestanden aan en kopieer de inhoud:
   - `index.html` → index.html
   - `script.html` → script.html
   - `style.html` → style.html
   - `fonts.html` → fonts.html
5. Update de Spreadsheet ID in `code.gs` (regel 54) indien nodig
6. Deploy als web app via "Deploy" > "New deployment" > "Web app"
7. Stel de juiste permissies in (execute as me, access: anyone)

**Functionaliteit:**
- Haalt automatisch data op voor vandaag uit Google Sheets
- Toont suites per verdieping (Boven, Begane grond, Kelder)
- Toont Audio, Colorgrading en Remote sets
- Stilte-modus toggle voor tijdens opnames

### 2. Demo Versie (`PL PLANNINGS SCHERM DEMO/`)

Standalone demo versie met placeholder data voor lokale ontwikkeling en testen.

**Bestanden:**
- `index.html` - Hoofd HTML bestand
- `script.js` - JavaScript met placeholder data
- `style.css` - CSS styling
- `fonts.css` - Font definities

**Setup instructies:**
1. Open `index.html` in een moderne browser
2. Of serveer lokaal met een web server (bijv. `python -m http.server` of `npx serve`)

**Functionaliteit:**
- Zelfde UI als AppScript versie
- Gebruikt placeholder data voor demo doeleinden
- Handig voor UI/UX ontwikkeling zonder Google Sheets connectie

## Features

- **Real-time data**: AppScript versie haalt live data op uit Google Sheets
- **Stilte-modus**: Toggle knop om stilte-modus in te schakelen tijdens opnames
- **Responsive design**: Werkt op verschillende schermformaten
- **Suite overzicht**: Georganiseerd per verdieping en type

## Google Sheets Structuur

De AppScript versie verwacht een Google Sheet met:
- Tab naam: `2025` (configureerbaar in `code.gs`)
- Kolom A: Datum (formaat: dd-MM-yyyy)
- Kolommen C, E-V, X-Y, AR, AC-AF, AH-AK, AM-AO: Suite data per sectie

Zie `code.gs` voor de exacte kolom mapping per sectie.

## Technologie

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Google Apps Script (JavaScript)
- **Data source**: Google Sheets

## Licentie

Post Lounge - Intern gebruik

