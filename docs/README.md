# Sylvie + Elias Idea Generator Documentation

This folder contains guidance for maintaining the app and handling private source notes.

## Purpose

The app is a mobile-first family support tool for quick activity ideas, sensory play, outdoor routines, and calm-down strategies.

## Adding new ideas

1. Open `src/data/ideas.ts`.
2. Add a new object to the `ideas` array.
3. Keep the fields consistent with the `Idea` type in `src/types/idea.ts`.
4. Save and run `npm run build` to verify the app compiles.

## Privacy rules

- The public app must not include raw therapy notes, personal reports, or assessment documents.
- Use `/private-source-notes/` for any local documents that should never be committed.
- The folder `/private-source-notes/` is excluded in `.gitignore`.

## Deployment

Deploy the app using Vercel or another static-hosting service.

- Build command: `npm run build`
- Output folder: `dist`
- No runtime database or analytics are required.
