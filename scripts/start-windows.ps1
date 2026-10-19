# Build and start Prelegal at http://localhost:8000
Set-Location (Join-Path $PSScriptRoot "..")

docker build -t prelegal .
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
docker rm -f prelegal *> $null
$envArgs = @()
if (Test-Path .env) { $envArgs = @("--env-file", ".env") }
docker run -d --name prelegal -p 8000:8000 @envArgs prelegal
Write-Host "Prelegal running at http://localhost:8000"
