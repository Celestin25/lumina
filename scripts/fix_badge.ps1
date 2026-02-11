# Retry Pair Extraordinaire Badge
# Uses Octocat as co-author.

$branchName = "feature/badge-retry-$(Get-Random)"
$coAuthor = "The Octocat <octocat@nowhere.com>"  # Using a generic email format often used for examples

Write-Host "Preparing branch '$branchName'..."
git checkout -b $branchName

$date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path "activity_log.txt" -Value "[$date] Badge Retry"
git add activity_log.txt

$msg = "feat: pairing with octocat"
# Explicitly clear env vars to avoid using backfill dates
Remove-Item Env:\GIT_AUTHOR_DATE -ErrorAction SilentlyContinue
Remove-Item Env:\GIT_COMMITTER_DATE -ErrorAction SilentlyContinue

git commit -m "$msg`n`nCo-authored-by: $coAuthor"

Write-Host "Pushing..."
git push origin $branchName

Write-Host "----------------------------------"
Write-Host "Please CPPR (Create Pull Request, Pull Request, Merge) for '$branchName'."
Write-Host "----------------------------------"

git checkout main
