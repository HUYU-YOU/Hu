# Hu

This repository now includes an experimental Next.js interface featuring a 3D globe rendered with `react-three-fiber`. The globe shows sample geolocated contents with thumbnails and offers filters by type, emotion colour and country, plus a main menu overlay. Clicking a point zooms the camera and emits a `content_click` event. A prototype Node HTTP server for authentication remains for reference.

## Usage

### Globe UI

```bash
npm install
npm run dev
```

Open <http://localhost:3000> to view the globe with day/night shading, filters and menu overlay. A settings panel is available
via the ⚙ button (or `Ctrl`/`Cmd` + `,`), and holding the “Vidéos” or “Lives” filter buttons for one second reveals quick
actions for those types.

### Fake API routes

The Next.js app serves an in-memory model used by the globe and settings panel.

- `GET /api/users/me` – fetch current user preferences
- `PATCH /api/users/me` – update preferences
- `POST /api/consents` – adjust consent flags
- `GET /api/globe/points` – retrieve points filtered by type, colour or country
- `POST /api/videos/upload` – add a new point

Hooks `useUser` and `useGlobeData` wrap these endpoints for the React components.

### Prototype API

```bash
node server.js
```

Endpoints:
- `POST /auth/register` with JSON `{ "email": "user@example.com", "password": "secret", "pseudonym": "Name" }`
- `POST /auth/login` with JSON `{ "email": "user@example.com", "password": "secret" }`
  - returns HTTP-only `token` cookie
- `POST /auth/logout` clears the session cookie
- `GET /users/me` returns current user info when `token` cookie is provided
- `GET /users/:id` returns public profile info

Data is stored in-memory and lost when the process stops.

### AI Gateway

A lightweight AI gateway exposes stub endpoints for moderation, classification and
recommendation. It aggregates simple services located under `services/`.

```bash
npm run ai
```

Endpoints:

- `POST /moderate` → returns a basic moderation decision
- `POST /classify` → returns a guessed emotion colour and categories
- `POST /recommend` → returns filtered items from `data/contents.json`
- `POST /feedback` → accepts user feedback and returns `{ "status": "ok" }`

All AI logic is placeholder and intended for experimentation only.

### Tests

Run the basic authentication flow test:

```bash
npm test
```
