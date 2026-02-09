# Fix Commit History (Robust Backfill)
# Generates realistic commits for the past 400 days on the MAIN branch.

$branch = "main"
git checkout $branch

$daysBack = 400
$startDate = (Get-Date).AddDays(-$daysBack)
$email = "celestinhakorimana25@gmail.com"

Write-Host "Starting robust backfill on $branch from $($startDate.ToString('yyyy-MM-dd'))"

for ($i = 0; $i -lt $daysBack; $i++) {
    $currentDate = $startDate.AddDays($i)
    $dayOfWeek = $currentDate.DayOfWeek
    $isWeekend = ($dayOfWeek -eq 'Saturday') -or ($dayOfWeek -eq 'Sunday')
    
    # Determine number of commits
    if ($isWeekend) {
        # 30% chance of 1-2 commits
        if ((Get-Random -Minimum 0 -Maximum 100) -lt 30) {
            $count = Get-Random -Minimum 1 -Maximum 3
        } else {
            $count = 0
        }
    } else {
        # 95% chance of 2-8 commits
        if ((Get-Random -Minimum 0 -Maximum 100) -lt 95) {
            $count = Get-Random -Minimum 2 -Maximum 9
        } else {
            $count = 0
        }
    }
    
    if ($count -gt 0) {
        for ($j = 0; $j -lt $count; $j++) {
            $msg = "fix: minor adjustments for $($currentDate.ToString('yyyy-MM-dd'))"
            
            # Time: 9am - 11pm
            $hour = Get-Random -Minimum 9 -Maximum 23
            $minute = Get-Random -Minimum 0 -Maximum 59
            $commitDate = $currentDate.Date.AddHours($hour).AddMinutes($minute).ToString("yyyy-MM-ddTHH:mm:ss")
            
            # Ensure file change
            $logEntry = "[$commitDate] $msg"
            Add-Content -Path "activity_log.txt" -Value $logEntry
            
            git add activity_log.txt
            
            $env:GIT_AUTHOR_DATE = $commitDate
            $env:GIT_COMMITTER_DATE = $commitDate
            
            git commit -m "$msg"
        }
    }
    
    if ($i % 20 -eq 0) {
        Write-Host "Processed $($currentDate.ToString('yyyy-MM-dd'))..."
    }
}

Remove-Item Env:\GIT_AUTHOR_DATE
Remove-Item Env:\GIT_COMMITTER_DATE

Write-Host "Backfill done. Listing last 5 commits:"
git log -n 5 --oneline
Write-Host "Ready to push."
