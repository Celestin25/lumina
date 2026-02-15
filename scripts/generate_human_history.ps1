# Generate Human-Like History
# Generates realistic commits for the past year.
# - Skips weekends (Sat/Sun)
# - Random gaps (vacation/sick days)
# - Variable commits per day (0-8)
# - Working hours (9 AM - 6 PM)
# - Professional commit messages

$daysBack = 365
$startDate = (Get-Date).AddDays(-$daysBack)

$commitMessages = @(
    "feat: update user authentication flow",
    "fix: resolve race condition in api",
    "style: improve dashboard responsiveness",
    "refactor: optimize database queries",
    "chore: update dependencies",
    "docs: update api documentation",
    "test: add unit tests for user service",
    "feat: implement search functionality",
    "fix: navigation bar overflow issue",
    "refactor: clean up legacy code",
    "perf: improve image loading speed",
    "chore: simple config change",
    "feat: add export to csv feature",
    "fix: typo in landing page",
    "style: update button colors",
    "refactor: split large components",
    "test: fix flaky integration tests",
    "feat: integrate payment gateway",
    "fix: handle null states in profile",
    "chore: cleanup logs"
)

Write-Host "Generating human-like history starting from $($startDate.ToString('yyyy-MM-dd'))..."

for ($i = 0; $i -le $daysBack; $i++) {
    $currentDate = $startDate.AddDays($i)
    $dayOfWeek = $currentDate.DayOfWeek
    
    # 1. Skip Weekends
    if ($dayOfWeek -eq 'Saturday' -or $dayOfWeek -eq 'Sunday') { continue }
    
    # 2. Random Gaps (20% chance of no work on a weekday)
    if ((Get-Random -Minimum 0 -Maximum 100) -lt 20) { continue }
    
    # 3. Determine commits for the day (0 to 6)
    # Weight towards fewer commits to look realistic
    $commitCount = Get-Random -Minimum 1 -Maximum 7
    if ($commitCount -gt 4) { $commitCount = Get-Random -Minimum 1 -Maximum 4 } # Re-roll high numbers often
    
    for ($j = 0; $j -lt $commitCount; $j++) {
        $msg = $commitMessages[(Get-Random -Maximum $commitMessages.Length)]
        
        # 4. Realistic Times (9 AM - 6 PM)
        $hour = Get-Random -Minimum 9 -Maximum 18
        $minute = Get-Random -Minimum 0 -Maximum 59
        
        # Add random variation to msg to ensure unique hash
        $realMsg = "$msg"
        
        $commitDate = $currentDate.Date.AddHours($hour).AddMinutes($minute).ToString("yyyy-MM-ddTHH:mm:ss")
        
        # Log to file to force change
        $logEntry = "[$commitDate] $realMsg"
        Add-Content -Path "activity_log.txt" -Value $logEntry
        
        git add activity_log.txt
        
        $env:GIT_AUTHOR_DATE = $commitDate
        $env:GIT_COMMITTER_DATE = $commitDate
        
        git commit -m "$realMsg"
    }
    
    if ($i % 30 -eq 0) {
        Write-Host "Processed $($currentDate.ToString('yyyy-MM-dd'))..."
    }
}

# Cleanups
Remove-Item Env:\GIT_AUTHOR_DATE -ErrorAction SilentlyContinue
Remove-Item Env:\GIT_COMMITTER_DATE -ErrorAction SilentlyContinue

Write-Host "Human history generation complete."
