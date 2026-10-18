#!/usr/bin/env bash
# Build and start Prelegal at http://localhost:8000
set -euo pipefail
cd "$(dirname "$0")/.."

docker build -t prelegal .
docker rm -f prelegal >/dev/null 2>&1 || true
env_file=""
[[ -f .env ]] && env_file="--env-file .env"
# shellcheck disable=SC2086
docker run -d --name prelegal -p 8000:8000 $env_file prelegal
echo "Prelegal running at http://localhost:8000"
