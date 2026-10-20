---
description: Find fresh Indian meme catchphrases and write data/memes.pending.json for review
---

Find short catchphrases for the Complain Box kiosk's meme voice. The app never searches the web itself; this command is the only way new memes get in, and every one is approved by hand in /admin.

1. Use web search to find:
   - about 15 catchphrases currently circulating in Indian meme culture (Instagram reels, X, YouTube shorts, this year), and
   - about 10 evergreen classics (Bollywood dialogues, TV serials, ads, old internet memes).
   Prefer phrases a college crowd would recognise instantly. Hinglish in Roman script is ideal.

2. Keep a phrase only if ALL of these hold:
   - 8 words or fewer, works as a standalone line in a sarcastic reply.
   - No NSFW or double meaning, no profanity or slurs (any language), no politics or politicians, no religion or god references, no caste, no regional or community stereotypes.
   - Does not target, mock or name a real private person. Film characters and dialogues are fine; avoid lines that only make sense as mockery of a real celebrity.
   - Not already in the list below (check the existing approved memes first with `sqlite3 data/app.db "select phrase from memes"` if sqlite3 is available; otherwise skip this check, the import script removes duplicates).

3. For each kept phrase write a one-line `note` on when people use it (this is shown to the model, keep it under 20 words) and a short `source` (film/show/ad and year, or "internet meme, 2025").

4. Write the result to `data/memes.pending.json` as a JSON array, replacing any old file:

```json
[
  { "phrase": "Kitne aadmi the?", "note": "Asking for a head count, usually when outnumbered.", "source": "Sholay (1975)" }
]
```

5. Show me the list as a short table (phrase, note, why it's safe), then tell me to run `npm run memes:import` and approve them at http://127.0.0.1:3000/admin.

If web search is not available in this session, say so plainly, do not invent "trending" phrases, and instead show me the JSON format above so I can paste a list in myself.
