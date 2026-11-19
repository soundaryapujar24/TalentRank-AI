# AI Powered Smart Hiring Platform - Frontend

Open `index.html` in a browser to run it. No installation needed.

## Files

| File | What it does |
|---|---|
| `index.html` | Page structure: landing page, HR screens, candidate screens |
| `css/style.css` | All colours, layout, cards, buttons, dark mode |
| `js/icons.js` | SVG icon paths |
| `js/data.js` | Demo data (candidates, chatbot questions, slots). Replaced by API calls later |
| `js/state.js` | Shared variables (selected candidate, resume stores, offline queue) |
| `js/utils.js` | Small helper functions |
| `js/ranking.js` | Ranked candidates, status rules, radar chart, filters, pipeline |
| `js/rounds.js` | Three recruitment rounds (Aptitude, GD, Technical), interview scheduler and Recruitment Overview |
| `js/offers.js` | Offer letters: generate, preview, release, view and download |
| `js/walkins.js` | Walk-in drives, registrations and results |
| `js/candidate.js` | Candidate "My application" timeline |
| `js/cv-builder.js` | AI CV builder chatbot and live CV preview |
| `js/storage.js` | My Generated CVs and My Uploaded Resumes (two separate lists) |
| `js/offline.js` | Offline mode and sync |
| `js/navigation.js` | Screen switching, landing page, notifications |
| `js/charts.js` | Analytics charts |
| `js/main.js` | Connects buttons to functions and starts the app (loaded last) |

The scripts are loaded in the order listed in `index.html`. Keep that order.

## New in this version
- **CV templates** (Modern, Classic, Minimal, Creative) in the AI CV builder. The template is saved with each CV and used in downloads.
- **Resume vault** (candidate): all generated and uploaded resumes in one place, each with an "Edit with AI" button.
- **Career Copilot**: one prompt re-tailors any saved resume for a new role (js/copilot.js). Also supports add/remove skill, add project or certification, shorter summary and template change. Saving creates a new resume, so the original stays safe.
- **Role fit meter + skill roadmap**: fit score before and after tailoring, and a learning plan for missing skills. The AI never adds skills the candidate does not have.
- Uploaded files can be made editable by pasting their text (the backend parser will do this automatically later).
- HR Analytics: "Shortlist rate by resume source" is now a dot (waffle) chart.
Backend TODO: replace cpPrompt() rule-based logic with an LLM call, and cpImport() with a real PDF/DOCX parser.
