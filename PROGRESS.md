# Progress

## Done
- Step 1 (setup): Next 15 + TS + Tailwind 4, better-sqlite3, motion, tsx. Assets in `public/assets` (postcard cropped to 1156x750, native res; originals in `assets-original/`). Palette + fonts (Rozha One / Kalam / Hind, Devanagari) in `app/globals.css`, `lib/fonts.ts`. `lib/postcardLayout.ts` measured. SQLite schema in `lib/db.ts`; `npm run db:seed` (30 identities, 18 approved exchanges, 20 approved memes; content in `scripts/seed-data.ts`).

- Step 2 (backend, code done): routes `/api/identity`, `/api/reply`, `/api/wall/post`, `/api/wall`. `lib/llm.ts` (+ warm-up in `instrumentation.ts`), `clean.ts`, `prompts.ts` (8 shots/voice), `reply.ts` (moderation and generation in parallel, 7s deadline), `blocklist.ts`, `moderate.ts`, `fallbackReplies.ts`, `repo.ts`. Scripts: `npm run bakeoff`, `npm run test:moderation`. Tested with curl with no model: fallbacks, deflection, 400, fail-closed post, double-post guard all work.

## Next
- Pull gemma3:4b, then run `npm run test:moderation` + `npm run bakeoff`, tune prompts. Then step 3 (flow with placeholder art).

## Known issues
- gemma3:4b not downloaded yet (network). Layer-2 moderation and real replies untested.
- 6 moderation cases (threats, sexual, harassment, injection) rely on the model; layer 1 can't catch them.
