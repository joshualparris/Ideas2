# Sylvie + Elias Idea Generator

A mobile-first family support app for quick sensory, outdoor, and routine ideas for Sylvie and Elias.

## Purpose

- Provide safe parent-facing activity suggestions.
- Keep private therapy notes and assessments out of the deployed app.
- Offer easy filters, favourites, routine planning, and backup support.

## Privacy

- The app does not include any personal reports, dates of birth, medical details, or private therapy notes.
- Raw source notes belong in `/private-source-notes/` only.
- `/private-source-notes/` is excluded from Git using `.gitignore`.

## Local setup

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm run dev
```

Build the app for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run tests:

```bash
npm run test
```

## Deployment

This app is ready for deployment to Vercel as a static site.

- Build output: `dist`
- No backend or database required
- No analytics or tracking included by default

## Adding ideas

- Add new front-facing ideas in `src/data/ideas.ts`.
- Keep the object shape matched to `src/types/idea.ts`.
- Avoid adding any sensitive or child-identifying source data to the public app.

## Notes

- The app is built with Vite, React, and TypeScript in strict mode.
- Local data like favourites, recent ideas, and saved routine plans are stored in browser localStorage.
