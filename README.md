# Complain Box (Taqneeq Post)

A fest kiosk: tap the post box, write a shikayat on a postcard, get a sarcastic reply from a local AI, and post it to the public wall. Runs fully offline on one Mac. No accounts, no API keys, no cost.

## One-time setup

```bash
node -v                      # needs Node 20+
npm install
ollama pull gemma3:4b        # the reply model (~3.4 GB); Ollama must be installed
cp .env.example .env.local   # OLLAMA_MODEL, WALL_REQUIRES_APPROVAL
npm run db:seed              # identities, 18 wall posts, 55 approved memes (safe to re-run)
```

Check it: `npm run test:moderation` must end with `0 fail`.

## Fest day

1. Make sure Ollama is running (menu-bar icon, or `ollama serve`).
2. Keep the Mac awake: `caffeinate -dims` in a spare terminal.
3. Start the app (production mode, smoother than dev):
   ```bash
   npm run fest
   ```
   Wait for `[llm] gemma3:4b warm` in the log before the first visitor.
4. Open the kiosk fullscreen in Chrome:
   ```bash
   open -na "Google Chrome" --args --kiosk --app=http://127.0.0.1:3000
   ```
   (Quit kiosk mode with Cmd+Q.) Safari works too: open the page, then View → Enter Full Screen.
5. Open `http://127.0.0.1:3000/admin` on a second screen or a window the visitors can't reach. Approve posts there. The wall is `http://127.0.0.1:3000/wall`.

Once you trust the filters, set `WALL_REQUIRES_APPROVAL=false` in `.env.local` and restart: passing posts go live immediately.

## Pages

| URL | What |
|---|---|
| `/` | The kiosk. Resets itself after 60 s of no input. |
| `/wall` | Drifting wall of approved posts. New ones glide in within ~20 s. Click a card to read it. |
| `/admin` | Approve / reject posts, remove posts from the wall, approve memes. |

## Fresh memes

In Claude Code, run `/refresh-memes` (uses Claude Code's web search, writes `data/memes.pending.json`), then:

```bash
npm run memes:import
```

and approve them in `/admin`. No web search? Write `data/memes.pending.json` yourself:
`[{ "phrase": "Kitne aadmi the?", "note": "when asking for a head count", "source": "Sholay (1975)" }]`

## Useful commands

| Command | What |
|---|---|
| `npm run fest` | Production build + start on 127.0.0.1:3000 |
| `npm run dev` | Development server |
| `npm run test:moderation` | 80 bad / borderline / normal inputs through the blocklist and the model |
| `npm run bakeoff` | Sample replies from every installed Ollama model, with timings |
| `npm run db:seed` | Re-seed identities, seed posts and memes |
| `npm run memes:import` | Load `data/memes.pending.json` as pending memes |

## Troubleshooting

- **Replies all sound canned / log says `warm-up failed`**: Ollama isn't running or the model isn't pulled. `ollama list` should show `gemma3:4b`. The kiosk keeps working on canned replies meanwhile, but nothing can pass the wall filter.
- **Waiting message shows for a few seconds**: normal. Replies take ~3 s (safety check + reply). They're capped at 8 s, then a canned reply is used.
- **Post says "This one's staying private"**: the blocklist or the model flagged it, or the model was down (the wall filter fails closed).
- **Self-harm mentions** get a kind reply with the Tele-MANAS helpline (14416), never a joke, and can't be posted.
- **Need a clean slate**: stop the app, delete `data/app.db`, run `npm run db:seed`.
- **Building while `npm run dev` is running** clobbers the dev server's `.next`. For a check build use `NEXT_DIST_DIR=.next-check npm run build`.
