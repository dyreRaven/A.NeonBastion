param(
  [string]$HealthUrl = "http://localhost:8787/healthz"
)

$ErrorActionPreference = "Stop"

Write-Host "Neon Bastion Multiplayer Regression Checklist" -ForegroundColor Cyan
Write-Host "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host ""

try {
  $health = Invoke-RestMethod -Method Get -Uri $HealthUrl -TimeoutSec 4
  if ($health.ok -eq $true) {
    Write-Host "[PASS] Server health endpoint reachable: $HealthUrl" -ForegroundColor Green
    if ($health.build) {
      Write-Host "       Server build: $($health.build)"
    }
  } else {
    Write-Host "[WARN] Health endpoint responded but 'ok' was not true." -ForegroundColor Yellow
  }
} catch {
  Write-Host "[WARN] Could not reach server health endpoint: $HealthUrl" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Manual checklist (Host + 1 Client):" -ForegroundColor Cyan
Write-Host "1. Join same room from two devices/browsers; confirm roster updates for join/leave."
Write-Host "2. Open menu during multiplayer and verify chat still sends/receives."
Write-Host "3. Spam test: send 6+ messages quickly and confirm throttling triggers."
Write-Host "4. Duplicate test: send same message repeatedly and confirm duplicate blocking."
Write-Host "5. Notification test: with chat panel closed, incoming message increments unread badge and plays sound."
Write-Host "6. Leave room and confirm chat history clears before joining a new room."
Write-Host "7. Reload page and confirm account auto-remembers login when startup lock is disabled."
Write-Host "8. Enable startup lock, reload page, and confirm game start is blocked until login."
Write-Host "9. Mobile check: on phone/tablet, status is one-line by default and expands on tap/hold."
Write-Host "10. Mobile low-FPS check: sustained low FPS auto-disables explosion particles and enemy rings."
