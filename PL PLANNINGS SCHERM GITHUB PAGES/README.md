# Planning Scherm - GitHub Pages Versie

Deze versie host de frontend op GitHub Pages en gebruikt AppScript als REST API backend.

## Setup Instructies

### 1. AppScript Backend Configureren

1. Open [Google Apps Script](https://script.google.com/)
2. Maak een **nieuw project** aan (dit is een aparte AppScript voor GitHub Pages)
3. Kopieer de inhoud van `code.gs` uit deze map naar je nieuwe AppScript project
4. Configureer de spreadsheet ID in `code.gs` (regel 7):
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
   ```
5. Configureer de tab naam in `code.gs` (regel 6):
   ```javascript
   const TAB_NAME = '2025'; // Pas aan naar de juiste tab naam
   ```
   
   **Let op:** Deze AppScript versie is veel simpeler - het geeft alleen ruwe data terug. 
   Alle configuratie (SECTION_COLUMNS) staat nu in `script.js` in de frontend!
6. Deploy als Web App:
   - Ga naar "Deploy" > "New deployment"
   - Kies "Web app" als type
   - Stel execute as in op "Me"
   - Stel "Who has access" in op "Anyone"
   - Klik op "Deploy"
   - **Kopieer de Web App URL** (je hebt deze nodig voor stap 2)

### 2. Frontend Configureren

1. Open `config.js` in deze map
2. Vervang `YOUR_APPSCRIPT_WEB_APP_URL_HERE` met de Web App URL die je in stap 1 hebt gekopieerd:
   ```javascript
   const APPSCRIPT_API_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
   ```

### 3. GitHub Pages Setup

1. Upload alle bestanden uit deze map naar een GitHub repository
2. Ga naar je repository op GitHub
3. Ga naar Settings > Pages
4. Onder "Source", selecteer de branch waar je bestanden staan (meestal `main` of `master`)
5. Selecteer de root folder (`/`)
6. Klik op "Save"
7. Je site is nu beschikbaar op: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### 4. Fonts (Optioneel)

Als je custom fonts wilt gebruiken:

1. Upload je font bestanden naar een `fonts/` map in je repository
2. Update `fonts.css` met de juiste paths naar je font bestanden
3. Of gebruik een externe font hosting service en update de URLs in `fonts.css`

## API Endpoints

De AppScript backend ondersteunt de volgende endpoints en geeft **ruwe data** terug:

### GET `/exec?path=today`
Haalt ruwe data op voor vandaag.

**Response:**
```json
{
  "rowNumber": 2,
  "dateLabel": "01-01-2025",
  "headers": ["Datum", "Kolom B", "NOTITIES", ...],
  "rowData": ["01-01-2025", "waarde B", "notitie tekst", ...]
}
```

### GET `/exec?path=row&row=2`
Haalt ruwe data op voor een specifieke rij.

**Response:**
```json
{
  "rowNumber": 2,
  "dateLabel": "01-01-2025",
  "headers": ["Datum", "Kolom B", "NOTITIES", ...],
  "rowData": ["01-01-2025", "waarde B", "notitie tekst", ...]
}
```

**Belangrijk:** De frontend (`script.js`) transformeert deze ruwe data naar de gewenste structuur op basis van de `SECTION_COLUMNS` configuratie. Dit betekent dat je configuratie wijzigingen kunt maken zonder AppScript opnieuw te deployen!

## Bestandsstructuur

```
PL PLANNINGS SCHERM GITHUB PAGES/
├── index.html          # Hoofd HTML bestand
├── config.js           # Configuratie (API URL, SECTION_COLUMNS, etc.)
├── utils.js            # Helper functies (data transformatie)
├── api.js              # API communicatie met AppScript
├── render.js            # Rendering functies voor UI
├── script.js            # Main entry point en event handlers
├── style.css           # CSS styling
├── fonts.css           # Font definities
└── README.md           # Deze file
```

**Let op:** De scripts worden in een specifieke volgorde geladen (zie `index.html`). Deze volgorde is belangrijk omdat modules elkaar gebruiken.

## Troubleshooting

### CORS Errors
Als je CORS errors krijgt, zorg ervoor dat:
- Je AppScript Web App is gedeployed met "Anyone" toegang
- De URL in `script.js` correct is

### Data wordt niet geladen
- Controleer de browser console voor errors
- Verifieer dat de AppScript URL correct is in `config.js`
- Test de AppScript URL direct in je browser (je zou JSON moeten zien)

### GitHub Pages werkt niet
- Zorg dat `index.html` in de root van je repository staat
- Controleer dat GitHub Pages is ingeschakeld in repository settings
- Wacht een paar minuten na het activeren (het kan even duren voordat de site live is)

## Licentie

[Voeg licentie informatie toe indien nodig]

