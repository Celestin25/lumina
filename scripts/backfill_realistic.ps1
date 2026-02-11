# Backfill Realistic Human History
# Generates commits with a realistic pattern:
# - Focuses on Weekdays (Mon-Fri)
# - Randomly skips some days
# - Varied commit counts (1-8 per day)
# - Time skewed to working hours (09:00 - 18:00)
# - Targets period BEFORE September 2025

$endDate = Get-Date -Date "2025-09-01"
$startDate = $endDate.AddDays(-365) # Go back another year from Sept 2025

$email = "celestinhakorimana25@gmail.com"

Write-Host "Starting realistic backfill from $($startDate.ToString('yyyy-MM-dd')) to $($endDate.ToString('yyyy-MM-dd'))"

$currentDate = $startDate

while ($currentDate -lt $endDate) {
    $dayOfWeek = $currentDate.DayOfWeek
    $isWeekend = ($dayOfWeek -eq 'Saturday') -or ($dayOfWeek -eq 'Sunday')
    
    $shouldCommit = $false
    
    if ($isWeekend) {
        # 20% chance to commit on weekends (hobby coding)
        if ((Get-Random -Minimum 0 -Maximum 100) -lt 20) { $shouldCommit = $true }
    } else {
        # 90% chance to commit on weekdays
        if ((Get-Random -Minimum 0 -Maximum 100) -lt 90) { $shouldCommit = $true }
    }
    
    if ($shouldCommit) {
        # Randomize number of commits (heavier on weekdays)
        if ($isWeekend) {
            $numCommits = Get-Random -Minimum 1 -Maximum 3
        } else {
            $numCommits = Get-Random -Minimum 1 -Maximum 8
        }
        
        for ($i = 0; $i -lt $numCommits; $i++) {
            $messages = @(
                "fix: unexpected bug in logic",
                "feat: implemented new requirement",
                "docs: updated readme",
                "style: formatting fixes",
                "refactor: slightly improved performance",
                "chore: cleanup",
                "wip: working on feature",
                "test: added unit tests"
            )
            $msg = $messages[(Get-Random -Maximum $messages.Length)]
            
            # Random time between 9 AM and 6 PM (plus some chaotic late nights)
            $hour = Get-Random -Minimum 9 -Maximum 18
            if ((Get-Random -Minimum 0 -Maximum 100) -lt 10) { $hour = Get-Random -Minimum 19 -Maximum 23 } # 10% chance of late night
            
            $minute = Get-Random -Minimum 0 -Maximum 59
            $second = Get-Random -Minimum 0 -Maximum 59
            
            $commitDate = $currentDate.Date.AddHours($hour).AddMinutes($minute).AddSeconds($second).ToString("yyyy-MM-ddTHH:mm:ss")
            
            # Update log
            $logEntry = "[$commitDate] $msg (Realistic Backfill)"
            Add-Content -Path "activity_log.txt" -Value $logEntry
            
            git add activity_log.txt
            
            $env:GIT_AUTHOR_DATE = $commitDate
            $env:GIT_COMMITTER_DATE = $commitDate
            
            git commit -m "$msg"
        }
    }
    
    $currentDate = $currentDate.AddDays(1)
}

# Clean upstream
Remove-Item Env:\GIT_AUTHOR_DATE
Remove-Item Env:\GIT_COMMITTER_DATE

Write-Host "Realistic backfill complete. Run 'git push' to update GitHub."
