# Progress

## Done
- Step 1 (setup): Next 15 + TS + Tailwind 4, better-sqlite3, motion, tsx. Assets in `public/assets` (postcard cropped to 1156x750, native res; originals in `assets-original/`). Palette + fonts (Rozha One / Kalam / Hind, Devanagari) in `app/globals.css`, `lib/fonts.ts`. `lib/postcardLayout.ts` measured. SQLite schema in `lib/db.ts`; `npm run db:seed` (30 identities, 18 approved exchanges, 20 approved memes; content in `scripts/seed-data.ts`).

## Next
- Step 2 (backend): API routes, lib/llm, prompts, reply, blocklist, moderation, fallbacks, bakeoff, test:moderation. Pull Ollama models first.

## Known issues
- None yet.
