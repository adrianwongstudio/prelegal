# Stop and remove the Prelegal container.
docker rm -f prelegal *> $null
Write-Host "Prelegal stopped"
