# Planning Scherm

Dashboard applicatie voor het weergeven van suite planningen en beschikbaarheid.

## Project Structuur

Dit project bevat drie versies:

### 1. AppScript Versie (`PL PLANNINGS SCHERM APPSCRIPT VERSIE/`)

Google Apps Script web applicatie die data ophaalt uit een Google Sheets spreadsheet.

**Bestanden:**
- `code.gs` - Apps Script backend code voor het ophalen van data uit Google Sheets
- `index.html` - Hoofd HTML template
- `script.html` - JavaScript code voor de frontend
- `style.html` - CSS styling
- `fonts.html` - Font definities

**Setup instructies:**

1. Open [Google Apps Script](https://script.google.com/)
2. Maak een nieuw project aan
3. Kopieer de inhoud van `code.gs` naar het `Code.gs` bestand
4. Maak de volgende HTML bestanden aan:
   - `index.html` (kopieer van `index.html`)
   - `script.html` (kopieer van `script.html`)
   - `style.html` (kopieer van `style.html`)
   - `fonts.html` (kopieer van `fonts.html`)
5. Configureer de spreadsheet ID in `code.gs` (regel 54):
   ```javascript
   const ss = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID');
   ```
6. Configureer de tab naam in `code.gs` (regel 5):
   ```javascript
   const TAB_NAME = '2025'; // Pas aan naar de juiste tab naam
   ```
7. Deploy als web app:
   - Ga naar "Deploy" > "New deployment"
   - Kies "Web app" als type
   - Stel execute as in op "Me"
   - Stel "Who has access" in op "Anyone"
   - Klik op "Deploy"

**Functionaliteit:**
- Haalt automatisch data op voor vandaag uit Google Sheets
- Toont suites per verdieping (Boven, Begane grond, Kelder)
- Toont audio, colorgrading en remote sets
- Stilte-modus toggle functionaliteit

### 2. Demo Versie (`PL PLANNINGS SCHERM DEMO/`)

Standalone HTML/CSS/JavaScript versie met placeholder data voor lokale ontwikkeling en testing.

**Bestanden:**
- `index.html` - Hoofd HTML bestand
- `script.js` - JavaScript code met placeholder data
- `style.css` - CSS styling
- `fonts.css` - Font definities

**Setup instructies:**

1. Open `index.html` in een moderne webbrowser
2. Of gebruik een lokale development server:
   ```bash
   # Met Python
   python -m http.server 8000
   
   # Met Node.js (http-server)
   npx http-server
   ```
3. Open `http://localhost:8000` in je browser

**Functionaliteit:**
- Zelfde UI als AppScript versie
- Gebruikt placeholder data in plaats van Google Sheets
- Handig voor UI/UX ontwikkeling en testing

### 3. GitHub Pages Versie (`PL PLANNINGS SCHERM GITHUB PAGES/`)

Frontend gehost op GitHub Pages met AppScript als REST API backend.

**Bestanden:**
- `index.html` - Hoofd HTML bestand
- `script.js` - JavaScript met fetch() API calls naar AppScript
- `style.css` - CSS styling
- `fonts.css` - Font definities
- `README.md` - Setup instructies voor GitHub Pages

**Setup instructies:**

Zie `PL PLANNINGS SCHERM GITHUB PAGES/README.md` voor gedetailleerde instructies.

**Functionaliteit:**
- Frontend gehost op GitHub Pages
- AppScript fungeert alleen als REST API backend
- Haalt data op via fetch() API calls
- Zelfde UI als andere versies

## Data Structuur

De applicatie verwacht data in de volgende structuur:

```javascript
{
  rowNumber: 2,
  dateLabel: '01-01-2025',
  data: {
    notes: [{ value: 'Notitie tekst' }],
    boven: [
      { label: 'SET 1 - Rector', value: 'Rector / 08:00 - 12:00' }
    ],
    begane: [...],
    kelder: [...],
    audio: [...],
    color: [...],
    remote: [...]
  }
}
```

## Google Sheets Configuratie

De AppScript versie verwacht een Google Sheets spreadsheet met:
- Kolom A: Datum (formaat: dd-MM-yyyy)
- Kolom C: Notities
- Kolommen E-L: Boven verdieping suites
- Kolommen Q-V: Begane grond suites
- Kolommen X, Y, AR: Kelder suites
- Kolommen AH-AK: Audio suites
- Kolommen AM-AO: Colorgrading suites
- Kolommen AC-AD, AE, AAF: Remote sets

Zie `code.gs` voor de exacte kolom mapping in `SECTION_COLUMNS`.

## Features

- **Stilte-modus**: Toggle knop om een pulserende rode achtergrond te activeren en notities te overschrijven
- **Responsive design**: Werkt op verschillende schermformaten
- **Real-time data**: AppScript versie haalt automatisch de meest recente data op

## Licentie

[Voeg licentie informatie toe indien nodig]

