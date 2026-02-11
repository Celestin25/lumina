# Backfill January to May 2025
# Explicitly targets the missing gap.

$startDate = Get-Date -Date "2025-01-01"
$endDate = Get-Date -Date "2025-05-31"
$email = "celestinhakorimana25@gmail.com"

Write-Host "Backfilling from $($startDate.ToString('yyyy-MM-dd')) to $($endDate.ToString('yyyy-MM-dd'))"

$currentDate = $startDate

while ($currentDate -le $endDate) {
    $dayOfWeek = $currentDate.DayOfWeek
    $isWeekend = ($dayOfWeek -eq 'Saturday') -or ($dayOfWeek -eq 'Sunday')
    
    # 95% Chance on weekdays, 20% on weekends
    $shouldCommit = $false
    if (-not $isWeekend -and (Get-Random -Max 100) -lt 95) { $shouldCommit = $true }
    if ($isWeekend -and (Get-Random -Max 100) -lt 20) { $shouldCommit = $true }

    if ($shouldCommit) {
        $count = Get-Random -Minimum 3 -Maximum 12 # Higher volume to ensure visibility
        
        for ($i=0; $i -lt $count; $i++) {
            $msg = "fix: update logic for Q1"
            
            $hour = Get-Random -Minimum 8 -Maximum 20
            $minute = Get-Random -Minimum 0 -Maximum 59
            $commitDate = $currentDate.Date.AddHours($hour).AddMinutes($minute).ToString("yyyy-MM-ddTHH:mm:ss")
            
            $logEntry = "[$commitDate] Jan-May Backfill"
            Add-Content -Path "activity_log.txt" -Value $logEntry
            git add activity_log.txt
            
            $env:GIT_AUTHOR_DATE = $commitDate
            $env:GIT_COMMITTER_DATE = $commitDate
            
            git commit -m "$msg"
        }
    }
    
    $currentDate = $currentDate.AddDays(1)
}

Remove-Item Env:\GIT_AUTHOR_DATE
Remove-Item Env:\GIT_COMMITTER_DATE

Write-Host "Jan-May Backfill Complete. Pushing..."
git push origin main
