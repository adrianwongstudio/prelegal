# prelegal
A platform for drafting common legal agreements.

## Status
🚧 In progress — expected completion by October 23, 2026.

## Running

Requires Docker. Builds one container and serves the app at http://localhost:8000.

```bash
scripts/start-mac.sh      # or start-linux.sh / start-windows.ps1
scripts/stop-mac.sh       # or stop-linux.sh / stop-windows.ps1
```

The sign-in screen is a placeholder for now: any (or no) input takes you to the Mutual NDA creator.

## Project structure
- `templates/` — Common Paper legal agreement templates (CC BY 4.0), indexed in `catalog.json`
- `frontend/` — Next.js app, statically exported and served by the backend (see `frontend/README.md`)
- `backend/` — FastAPI (uv) app serving `/api/*` and the frontend; SQLite database recreated on each start
- `scripts/` — start/stop scripts for Mac, Linux and Windows
- `Dockerfile` — multi-stage build: Node builds the frontend, Python runs the backend
