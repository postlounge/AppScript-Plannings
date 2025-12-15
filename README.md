# Planning Scherm

Dashboard applicatie voor het weergeven van suite planningen en beschikbaarheid.

## Project Structuur

De actieve versie van dit project is:

### GitHub Pages Versie (`PL PLANNINGS SCHERM GITHUB PAGES/`)

Frontend gehost op GitHub Pages met Apps Script als REST API backend.

**Belangrijkste bestanden in die map:**
- `index.html` - Hoofd HTML bestand
- `script.js` - JavaScript (slideshow, timers, stilte-modus, refresh)
- `render.js` - Rendering van data naar de UI
- `api.js` - Fetch + caching logica
- `config.js` - Kolom-mapping en sectieconfiguratie
- `style.css` - CSS styling
- `fonts.css` - Font definities
- `code.gs` - Apps Script backend voorbeeld
- `README.md` - Uitgebreide setup-instructies voor GitHub Pages versie

**Setup & gebruik:**

- Zie `PL PLANNINGS SCHERM GITHUB PAGES/README.md` voor alle details (Apps Script deploy, API URL instellen, layout uitleg).

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

- **Opnames**: Toggle knop om een pulserende rode achtergrond te activeren
- **Real-time data**: AppScript versie haalt automatisch de meest recente data op

