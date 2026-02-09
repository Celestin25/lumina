# Backfill Commit History
# This script generates commits for past dates to fill in the contribution graph.

$daysToGoBack = 365
$maxCommitsPerDay = 5
$email = "celestinhakorimana25@gmail.com"

Write-Host "Starting backfill for the last $daysToGoBack days..."

$startDate = (Get-Date).AddDays(-$daysToGoBack)

for ($i = 0; $i -lt $daysToGoBack; $i++) {
    $currentDate = $startDate.AddDays($i)
    
    # 60% chance to commit on a given day to make it look somewhat natural, 
    # but the user asked to "make those days... look like i committed", so maybe higher probability?
    # User said: "make those days on github i did not commit look like i committed something"
    # So I will commit EVERY day or almost every day. Let's say 90% chance.
    if ((Get-Random -Minimum 0 -Maximum 100) -lt 90) {
        $commitsToday = Get-Random -Minimum 1 -Maximum ($maxCommitsPerDay + 1)
        
        for ($j = 0; $j -lt $commitsToday; $j++) {
            $msg = "chore: Backfill commit for $($currentDate.ToString('yyyy-MM-dd'))"
            $dateStr = $currentDate.AddHours(9 + $j).ToString("yyyy-MM-ddTHH:mm:ss")
            
            # Update activity log to ensure file change
            $logEntry = "[$dateStr] $msg"
            Add-Content -Path "activity_log.txt" -Value $logEntry
            
            git add activity_log.txt
            
            # Set environment variables for git dates
            $env:GIT_AUTHOR_DATE = $dateStr
            $env:GIT_COMMITTER_DATE = $dateStr
            
            git commit -m "$msg"
        }
        Write-Host "Generated $commitsToday commits for $($currentDate.ToString('yyyy-MM-dd'))"
    }
}

# Clean up env vars
Remove-Item Env:\GIT_AUTHOR_DATE
Remove-Item Env:\GIT_COMMITTER_DATE

Write-Host "Backfill complete. Run 'git push' to update GitHub."
