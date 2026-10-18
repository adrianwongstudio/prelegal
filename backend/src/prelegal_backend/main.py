"""FastAPI app serving the JSON API under /api and the static frontend at /."""

import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from prelegal_backend.db import init_db


def create_app(db_path: Path, static_dir: Path) -> FastAPI:
    """Build the app. The frontend is mounted only if its build output exists."""

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        init_db(db_path)
        yield

    app = FastAPI(title="Prelegal", lifespan=lifespan)

    @app.get("/api/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    if static_dir.is_dir():
        app.mount("/", StaticFiles(directory=static_dir, html=True), name="frontend")
    return app


app = create_app(
    db_path=Path(os.environ.get("PRELEGAL_DB_PATH", "prelegal.db")),
    static_dir=Path(os.environ.get("PRELEGAL_STATIC_DIR", "../frontend/out")),
)
