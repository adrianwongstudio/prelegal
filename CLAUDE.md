# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

See "Current status" at the end for what is implemented so far.

## Development process

When instructed to build a feature:
1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your github tools

## AI design

When writing code to make calls to LLMs, use your Cerebras skill to use LiteLLM via OpenRouter to the `openrouter/openai/gpt-oss-120b` model with Cerebras as the inference provider. You should use Structured Outputs so that you can interpret the results and populate fields in the legal document.

There is an OPENROUTER_API_KEY in the .env file in the project root.

## Technical design

The entire project should be packaged into a Docker container.  
The backend should be in backend/ and be a uv project, using FastAPI.  
The frontend should be in frontend/  
The database should use SQLLite and be created from scratch each time the Docker container is brought up, allowing for a users table with sign up and sign in.  
The frontend is statically exported (Next.js `output: "export"`) and served by FastAPI. Partial Prerendering features (`cacheComponents`, `partialPrefetching`) are not allowed in export mode.  
There should be scripts in scripts/ for:  
```bash
# Mac
scripts/start-mac.sh    # Start
scripts/stop-mac.sh     # Stop

# Linux
scripts/start-linux.sh
scripts/stop-linux.sh

# Windows
scripts/start-windows.ps1
scripts/stop-windows.ps1
```
Backend available at http://localhost:8000

## Color Scheme
- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`

## Current status

- **PL-2** (merged): Common Paper templates in `templates/`, indexed in `catalog.json`.
- **PL-3** (merged): Mutual NDA creator — form, live preview and PDF download (`@react-pdf/renderer`), now at `/nda`. No AI chat yet; other document types not started.
- **PL-4** (PR #7): V1 foundation.
  - `backend/`: uv + FastAPI (`src/prelegal_backend/`), `GET /api/health`, serves the frontend build. SQLite DB is deleted and recreated with an empty `users` table on every startup. Config via `PRELEGAL_DB_PATH` and `PRELEGAL_STATIC_DIR`.
  - `frontend/`: `/` is a placeholder sign-in screen with no authentication; it just navigates to `/nda`.
  - Multi-stage `Dockerfile` (Node builds the frontend, Python runs the backend); `scripts/` start/stop for Mac, Linux and Windows. Verified end to end on Mac; PowerShell scripts untested.
  - CI: `Frontend CI` (lint, typecheck, Vitest, build) and `Backend CI` (pytest).
- **Not yet built**: real sign up / sign in, AI chat (LiteLLM via OpenRouter, see the `cerebras` skill), document types beyond the Mutual NDA, document persistence.
- **Known follow-up**: the NDA's default Effective Date is baked in at build time; may cause a hydration mismatch on later days (unconfirmed).
