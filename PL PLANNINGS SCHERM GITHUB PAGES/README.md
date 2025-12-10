# Planning Scherm - GitHub Pages Versie

Deze versie host de frontend op GitHub Pages en gebruikt AppScript als REST API backend.

## Setup Instructies

### 1. AppScript Backend Configureren

1. Open [Google Apps Script](https://script.google.com/)
2. Maak een nieuw project aan of open je bestaande project
3. Kopieer de inhoud van `../PL PLANNINGS SCHERM APPSCRIPT VERSIE/code.gs` naar je AppScript project
4. Configureer de spreadsheet ID in `code.gs` (regel 54):
   ```javascript
   const ss = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID');
   ```
5. Configureer de tab naam in `code.gs` (regel 5):
   ```javascript
   const TAB_NAME = '2025'; // Pas aan naar de juiste tab naam
   ```
6. Deploy als Web App:
   - Ga naar "Deploy" > "New deployment"
   - Kies "Web app" als type
   - Stel execute as in op "Me"
   - Stel "Who has access" in op "Anyone"
   - Klik op "Deploy"
   - **Kopieer de Web App URL** (je hebt deze nodig voor stap 2)

### 2. Frontend Configureren

1. Open `script.js` in deze map
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

De AppScript backend ondersteunt de volgende endpoints:

### GET `/exec?path=today`
Haalt data op voor vandaag.

**Response:**
```json
{
  "data": {
    "notes": [{ "value": "..." }],
    "boven": [{ "label": "...", "value": "..." }],
    ...
  },
  "rowNumber": 2,
  "dateLabel": "01-01-2025"
}
```

### GET `/exec?path=row&row=2`
Haalt data op voor een specifieke rij.

**Response:**
```json
{
  "data": { ... },
  "rowNumber": 2,
  "dateLabel": "01-01-2025"
}
```

## Bestandsstructuur

```
PL PLANNINGS SCHERM GITHUB PAGES/
├── index.html          # Hoofd HTML bestand
├── script.js           # JavaScript met fetch() API calls
├── style.css           # CSS styling
├── fonts.css           # Font definities
└── README.md           # Deze file
```

## Troubleshooting

### CORS Errors
Als je CORS errors krijgt, zorg ervoor dat:
- Je AppScript Web App is gedeployed met "Anyone" toegang
- De URL in `script.js` correct is

### Data wordt niet geladen
- Controleer de browser console voor errors
- Verifieer dat de AppScript URL correct is in `script.js`
- Test de AppScript URL direct in je browser (je zou JSON moeten zien)

### GitHub Pages werkt niet
- Zorg dat `index.html` in de root van je repository staat
- Controleer dat GitHub Pages is ingeschakeld in repository settings
- Wacht een paar minuten na het activeren (het kan even duren voordat de site live is)

## Licentie

[Voeg licentie informatie toe indien nodig]

