# /tools/diag-aegis-tree.ps1
# Run from repo root: powershell -ExecutionPolicy Bypass -File .\tools\diag-aegis-tree.ps1

$ErrorActionPreference = "SilentlyContinue"

Write-Host ""
Write-Host "=== AEGIS-ARBITER STRUCTURE CHECK ==="
Write-Host "Root: $(Get-Location)"
Write-Host ""

# Show key root files
$rootFiles = @("package.json", "tsconfig.json")
Write-Host "Root files:"
foreach ($f in $rootFiles) {
  if (Test-Path $f) { Write-Host "  OK  $f" }
  else { Write-Host "  MISSING  $f" }
}
Write-Host ""

# Show src tree (folders + files)
if (Test-Path "src") {
  Write-Host "src/ tree (folders + files):"
  Get-ChildItem -Path "src" -Recurse -Force |
    Sort-Object FullName |
    ForEach-Object {
      $rel = $_.FullName.Substring((Join-Path (Get-Location) "src").Length).TrimStart('\')
      if ($_.PSIsContainer) { Write-Host "  [D] $rel" }
      else { Write-Host "  [F] $rel" }
    }
} else {
  Write-Host "MISSING  src/"
}
Write-Host ""

# Check the exact files our imports depend on
$mustHave = @(
  "src/storage/sqlite/db.ts",
  "src/storage/sqlite/migrate.ts",
  "src/storage/sqlite/schema.sql",
  "src/audit/auditLogger.ts",
  "src/audit/auditTypes.ts",
  "src/bookcase/bookcase.ts",
  "src/settings/storageSettings.ts",
  "src/sovereign/commands/parseSovereignCommand.ts",
  "src/sovereign/commands/handleSovereignCommand.ts",
  "src/localAegisBootstrap.ts",
  "src/runLocal.ts"
)

Write-Host "Critical file check:"
foreach ($p in $mustHave) {
  if (Test-Path $p) { Write-Host "  OK  $p" }
  else { Write-Host "  MISSING  $p" }
}
Write-Host ""

# Print TypeScript config hints
Write-Host "TS hints:"
if (Test-Path "tsconfig.json") {
  $ts = Get-Content "tsconfig.json" -Raw
  if ($ts -match '"module"\s*:\s*"NodeNext"') { Write-Host "  OK  module: NodeNext" } else { Write-Host "  WARN  module not NodeNext" }
  if ($ts -match '"moduleResolution"\s*:\s*"NodeNext"') { Write-Host "  OK  moduleResolution: NodeNext" } else { Write-Host "  WARN  moduleResolution not NodeNext" }
  if ($ts -match '"types"\s*:\s*\[\s*"node"\s*\]') { Write-Host "  OK  types: [node]" } else { Write-Host "  WARN  @types/node not referenced" }
} else {
  Write-Host "  WARN  tsconfig.json missing"
}
Write-Host ""
Write-Host "=== END CHECK ==="
Write-Host ""
