# Backfill Commit History (100% Coverage)
# This script generates commits for EVERY DAY in the past year.

$daysToGoBack = 365
$maxCommitsPerDay = 10
$minCommitsPerDay = 3 # Ensure at least 3 commits every day
$email = "celestinhakorimana25@gmail.com"

Write-Host "Starting 100% daily backfill for the last $daysToGoBack days..."

$startDate = (Get-Date).AddDays(-$daysToGoBack)

for ($i = 0; $i -lt $daysToGoBack; $i++) {
    $currentDate = $startDate.AddDays($i)
    
    # 100% chance to commit (we want no gaps)
    $commitsToday = Get-Random -Minimum $minCommitsPerDay -Maximum ($maxCommitsPerDay + 1)
    
    for ($j = 0; $j -lt $commitsToday; $j++) {
        $msg = "chore: Daily activity for $($currentDate.ToString('yyyy-MM-dd'))"
        # Spread commits through the day
        $dateStr = $currentDate.AddHours(8 + $j).AddMinutes((Get-Random -Minimum 0 -Maximum 59)).ToString("yyyy-MM-ddTHH:mm:ss")
        
        # Update activity log to ensure file change
        $logEntry = "[$dateStr] $msg"
        Add-Content -Path "activity_log.txt" -Value $logEntry
        
        git add activity_log.txt
        
        # Set environment variables for git dates
        $env:GIT_AUTHOR_DATE = $dateStr
        $env:GIT_COMMITTER_DATE = $dateStr
        
        git commit -m "$msg"
    }
    
    if ($i % 10 -eq 0) {
        Write-Host "Filled $($currentDate.ToString('yyyy-MM-dd')) with $commitsToday commits..."
    }
}

# Clean up env vars
Remove-Item Env:\GIT_AUTHOR_DATE
Remove-Item Env:\GIT_COMMITTER_DATE

Write-Host "Backfill complete. Run 'git push' to update GitHub."
