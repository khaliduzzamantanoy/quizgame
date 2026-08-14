# QUIZ.EXE

A retro monochrome terminal-style quiz game with a huge trivia system.

## Features

- **Unlimited questions** — live feed from the [Open Trivia Database](https://opentdb.com) or a built-in offline bank (158 English + 78 Bengali questions).
- **13 categories** — Countries of the World, Geography, General Knowledge, Science, History, Computers, Sports, Movies, Music, Mythology, Animals, Politics, Art & Literature.
- **Languages** — English and বাংলা (Bengali / BD). The local database fully supports both; the online feed is English-only.
- **Configurable runs** — question count (5/10/15/20/ALL), difficulty filter (online), realistic 15s timer.
- **Ranking board** — top 10 operators stored locally in your browser.
- **High score persistence** — saved across sessions.

## Usage

Open `index.html` in a browser. For the unlimited online feed, serve the folder (e.g. `npx serve`) so `fetch()` works:

```bash
npx serve
```

Then:

1. Enter your name (required).
2. Pick a source: `LOCAL DATABASE` or `UNLIMITED ONLINE (LIVE)`.
3. Choose a category, language, and question count.
4. Press `[ PRESS START ]`.

## Stack

Vanilla HTML / CSS / JavaScript. No build step, no dependencies.