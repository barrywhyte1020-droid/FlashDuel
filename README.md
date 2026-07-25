# FlashDuel — Flashcard Study Duel App

Create flashcard decks, study them solo with spaced repetition, or challenge
a friend to a timed quiz duel with side-by-side score comparison.

## Project structure

```
flashduel/
├── .github/workflows/   CI - runs backend tests on push
├── backend/             Node.js + Express + MongoDB API + Socket.io + tests
├── mobile/               React Native app (Expo) — iOS, Android, and web
└── docker-compose.yml   One-command backend + MongoDB spin-up
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET if needed
npm run dev                # starts on http://localhost:4000
```

You need a MongoDB instance running. Easiest options:
- Install MongoDB Community locally, or
- Use a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and paste
  its connection string into `MONGO_URI` in `.env`

Check it's alive: open `http://localhost:4000/api/health` — you should see
`{"status":"ok"}`.

## 2. Mobile app setup

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with **Expo Go** (iOS/Android) or press `w` for the web
preview, `i` for iOS simulator, `a` for Android emulator.

### Point the app at your backend

Open `mobile/src/api/config.js`:

```js
export const API_BASE_URL = 'http://localhost:4000/api';
```

- **Web preview / iOS simulator on the same machine**: `localhost` works.
- **Physical phone via Expo Go, or Android emulator**: replace `localhost`
  with your computer's LAN IP, e.g. `http://192.168.1.20:4000/api`
  (find it with `ipconfig` on Windows or `ifconfig`/`ip a` on Mac/Linux —
  make sure your phone is on the same Wi-Fi network).

## Professional-grade additions

- **Live duels**: `mobile/src/api/socket.js` + `backend/src/sockets/duelSocket.js` —
  both players join a Socket.io room keyed by the invite code and see each
  other's live card progress and running score while playing. Pick "Live"
  vs "Async" mode on the Duel Setup screen.
- **Automated tests**: `backend/tests/` — Jest + Supertest, covering the
  scoring algorithm (accuracy/speed tradeoffs) and API-level guards (auth
  required, input validation, 404 handling). Run with `npm test` inside
  `backend/`.
- **Input validation**: `backend/src/validation.js` — Zod schemas for every
  mutating route (register, login, deck/card create & update, duel create &
  submit), returning clear field-level error messages instead of generic 500s.
- **Security hardening**: `helmet` for HTTP header hardening and
  `express-rate-limit` on auth routes (20 attempts / 15 min) — see
  `backend/src/app.js`.
- **Docker**: `docker-compose.yml` at the project root spins up the API +
  MongoDB together in one command — see "Run with Docker" below.
- **CI**: `.github/workflows/backend-ci.yml` runs the backend test suite on
  every push/PR to `main`.
- **UX polish**: skeleton loading states (`mobile/src/components/Skeleton.js`)
  and haptic feedback on duel answers (`expo-haptics`).

### Run with Docker

From the project root, with Docker installed:

```bash
docker compose up --build
```

This starts MongoDB and the API together — no local Mongo install needed.
The API will be reachable at `http://localhost:4000`. Point the mobile app's
`API_BASE_URL` at it as described above.

### Run the backend test suite

```bash
cd backend
npm install
npm test
```

## Features implemented

- **Auth**: register/login (JWT), persisted session
- **Deck Builder**: create/edit/delete decks, add/edit/delete cards, accent colors
- **Solo Study Mode**: Leitner-box spaced repetition (missed cards resurface sooner)
- **Duel Engine**: host a duel on a deck → get a 6-character invite code;
  a friend joins with the code; both play the same timed round independently
  (async) and results are compared once both finish
- **Scoring System**: accuracy + speed-bonus formula (see `backend/src/scoring.js`)
- **Leaderboard**: global rankings by wins/streak
- **Deck Sharing**: toggle a deck public to get a shareable code
- **Light / dark mode**: system-aware with a manual override, persisted locally
- **Socket.io scaffold** (`backend/src/sockets/duelSocket.js`) is wired up for a
  live/synchronous duel mode as a stretch goal — the async flow above works
  fully without it

## Design system

The UI uses a small token system (`mobile/src/theme/tokens.js`) rather than
hardcoded colors: an indigo/violet "duel" palette, Space Grotesk for
headings and Inter for body text, and a signature "VS" badge component
that appears on the Duel Setup, Duel Play, and Results screens to keep the
competitive framing visible throughout the app.

## Notes for your project defense

- `backend/src/scoring.js` documents the scoring formula in one place —
  good to reference when explaining the Scoring System module.
- `backend/src/models/Duel.js` shows how both async and live duels share one
  schema (`mode: 'async' | 'live'`).
- `mobile/src/screens/StudyModeScreen.js` shows the Leitner-box spaced
  repetition logic (cards in a lower "box" are prioritized).
- `backend/tests/scoring.test.js` is a good one to walk through live — it
  demonstrates that accuracy is weighted more heavily than speed (a fast
  player who guesses wrong loses to a slower, accurate one).
- `backend/src/validation.js` shows the input-validation layer if asked
  about error handling / robustness.

## Not yet built (good "future work" answers if asked)

- Push notifications when an opponent finishes an async round
- Deck categories/tags + search UI on the public deck browser (the backend
  route already supports it: `GET /api/decks/public?search=`)
- Tournaments / best-of-3 duels
- Refresh tokens (current JWT is a single 30-day token)
