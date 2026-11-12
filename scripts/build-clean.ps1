$ErrorActionPreference = 'Stop'
Push-Location (Split-Path $PSScriptRoot -Parent)
try {
    node scripts/prepare-clean.cjs
    if ($LASTEXITCODE -ne 0) { throw 'Source preparation failed' }
    New-Item -ItemType Directory -Force standalone/build | Out-Null
    java -jar tools/ffdec/ffdec.jar -importScript original/game.swf standalone/build/crazy-battle.swf standalone/scripts
    if ($LASTEXITCODE -ne 0) { throw 'SWF compilation failed' }
    if (-not (Test-Path standalone/build/crazy-battle.swf)) { throw 'Compiled SWF missing' }
    Write-Output 'Built standalone/build/crazy-battle.swf'
} finally {
    Pop-Location
}
