# Copilot Instructions for PL Plannings Scherm

## Project Overview
**DEMO VERSION**: This folder contains a standalone HTML/CSS/JS demo of the dashboard UI for reference and prototyping. The real production project is built as a **Google Apps Script** application with backend functionality and data persistence.

This demo displays scheduling information for Postlounge facility suites across multiple floors and specialized rooms (audio, colorgrading, remote sets) as a client-side application with no backend or build process.

## Architecture & Data Flow

**Core Pattern**: Configuration-driven rendering
- `SECTION_CONFIG` (script.js) maps logical sections (boven, begane, kelder, audio, color, remote) to DOM element IDs
- Data flows: `payload` → `handleDashboardData()` → `renderDashboard()` → DOM population
- Each section has a left list (suite/room names) and right side (detailed info) with a divider separator

**Key Data Structure**:
- Payload format: `{ rowNumber: int, dateLabel: string, data: { [sectionKey]: [{label, value}, ...] } }`
- Empty values default to "Beschikbaar" (available)
- Notes section is special—single string instead of key-value pairs

## UI Layout
- **Top row**: Postlounge logo + notes card (full-width right side)
- **Main grid**: Two large cards (boven, begane) + right column of 4 small cards (kelder, audio, color, remote)
- **Card structure**: Title → left list (initially shown, hidden when data loads) + divider + right side (empty until populated)
- **Responsive**: Single-column layout on screens ≤768px

## Development Patterns

### Adding New Sections
1. Add to `SECTION_CONFIG` with `listId` and `infoId` matching HTML element IDs
2. Add corresponding HTML elements in `index.html` within appropriate `.card` container
3. Include new data array in `PLACEHOLDER_PAYLOAD.data` for testing
4. Rendering happens automatically via `renderDashboard()` loop

### Styling Conventions
- **Cards**: Red background (`#ff0000`), 25-35px padding, 10px border radius
- **Text**: Open Sans font, 20px base size in lists
- **Colors**: Red (`#ff0000`, `#ef0000`), dark backgrounds (`#666`)
- **Spacing**: Grid gaps 30-100px; tight pair-row gaps (10px)

### Data Handling
- `populateSection()`: Creates pair-list structure (label/value grid layout)
- `populateNote()`: Single text content
- Empty sections show contextual message: "Geen data gevonden voor [rij X / datum XX / deze dag]"
- List is hidden and divider shown only when data is empty

## Running the Demo
- **No dependencies**: HTML/CSS/JS only (no frameworks or build tools)
- **Font**: Open Sans from Google Fonts
- **Running**: Open `index.html` directly in browser
- **Testing**: Modify `PLACEHOLDER_PAYLOAD` in script.js to preview different data states

## Integration with Google Apps Script
The real project uses Google Apps Script for backend logic. This demo serves as:
- UI reference for the Google Apps Script frontend
- Testing ground for HTML/CSS/JS layout changes
- Payload structure validation before backend integration
- When modifying data structures or adding sections, ensure changes align with the Google Apps Script implementation

## Dutch Language Notes
- All UI text and data labels use Dutch (e.g., "Notities", "Beschikbaar", "Suites", "Kelder")
- Error messages include context prepositions: "rij", "datum", "deze dag"
