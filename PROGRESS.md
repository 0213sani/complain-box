# Progress

## Done
- Step 1 (setup): Next 15 + TS + Tailwind 4, better-sqlite3, motion, tsx. Assets in `public/assets` (postcard cropped to 1156x750, native res; originals in `assets-original/`). Palette + fonts (Rozha One / Kalam / Hind, Devanagari) in `app/globals.css`, `lib/fonts.ts`. `lib/postcardLayout.ts` measured. SQLite schema in `lib/db.ts`; `npm run db:seed` (30 identities, 18 approved exchanges, 20 approved memes; content in `scripts/seed-data.ts`).

- Step 2 (backend, done; model gemma3:4b): routes `/api/identity`, `/api/reply`, `/api/wall/post`, `/api/wall`. `lib/llm.ts` (+ warm-up in `instrumentation.ts`), `clean.ts`, `prompts.ts` (8 shots/voice), `reply.ts` (moderation and generation in parallel, 7s deadline), `blocklist.ts`, `moderate.ts`, `fallbackReplies.ts`, `repo.ts`. Scripts: `npm run bakeoff`, `npm run test:moderation`. Tested with curl with no model: fallbacks, deflection, 400, fail-closed post, double-post guard all work.
- Step 3 (flow, placeholder art): `components/Kiosk.tsx` wires the state machine (`lib/kiosk/machine.ts`), API helpers (`lib/kiosk/api.ts`, 8s client cap), idle reset (60s). `Stage` (1600x1000 scaled), `PostBox` (wobble), `WritingCard` (typed address + PIN, Kalam textarea, Enter/Shift+Enter/Esc, Send stamp), `ReplyCard` (typed reply, Re: line, REPLIED postmark, 3 buttons, RECEIVED/POSTED/private states), `Postmark`, `Sign`, `PlaceholderScene`, `PlaceholderPostman` (ride out/back, mirrored). `/wall` stub. Stage geometry in `lib/kiosk/stage.ts`. Check builds: `NEXT_DIST_DIR=.next-check npm run build` (doesn't clobber a running dev server).
- Step 4 (scene + postman, v2 after feedback "too bare, wrong scale, no shadows"): scene modelled on the PDF reference. `components/scene/`: `palette.ts` (+ seeded rng), `Backdrop` (sky, hazy pink buildings), `PostOffice` (patchy red wall, painted डाक घर, diagonal tree shadow, tin awning, pigeonhole interior, counter), `Foliage` (canopy, bananas), `Props` (fruit stall + tarp, bench, sacks, wires), `People` (standing, seated reader), `Ground` (dust, cast shadows), `Atmosphere` (haze, vignette, grain). Scale: box 360px, postman 480px. Postman has lit/shade facets and a cast shadow on a non-mirrored layer. SVG text must use style fontFamily (attribute can't read CSS vars).

## Next
- User to judge motion on the real screen (idle loop, ride out ~0.85s bell + 2s ride, ride back). Then step 5 (wall + /admin).

## Known issues
- test:moderation: 53/53 pass with gemma3:4b (~1s per check). 6 cases (threats, sexual, harassment, injection) rely on the model.
- Replies ~1s. Prompt fixes: random opener per relative reply; meme examples offer 3 memes and use one.
