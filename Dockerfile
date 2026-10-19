# Stage 1: build the Next.js frontend as a static export.
FROM node:24-slim AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY templates/ /app/templates/
COPY frontend/ ./
RUN npm run build

# Stage 2: FastAPI backend serving the API and the static frontend.
FROM python:3.13-slim
COPY --from=ghcr.io/astral-sh/uv:0.13 /uv /uvx /bin/
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
WORKDIR /app/backend
COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --locked --no-dev --no-install-project
COPY backend/ ./
RUN uv sync --locked --no-dev && mkdir -p /app/data
COPY --from=frontend /app/frontend/out /app/static
ENV PRELEGAL_STATIC_DIR=/app/static \
    PRELEGAL_DB_PATH=/app/data/prelegal.db \
    PATH="/app/backend/.venv/bin:$PATH"
EXPOSE 8000
CMD ["uvicorn", "prelegal_backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
