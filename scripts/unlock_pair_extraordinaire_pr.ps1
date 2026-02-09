# Unlock Pair Extraordinaire via PR
# 1. Creates a new branch
# 2. Creates a commit with a co-author
# 3. Pushes the branch
# 4. Instructions for the User to open a PR

$branchName = "feature/pair-extraordinaire-$(Get-Random)"
$coAuthorName = "github-actions[bot]"
$coAuthorEmail = "41898282+github-actions[bot]@users.noreply.github.com"

Write-Host "Preparing branch '$branchName' for Pair Extraordinaire badge..."

git checkout -b $branchName

$date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path "activity_log.txt" -Value "[$date] Pair Extraordinaire preparation"
git add activity_log.txt

$msg = "feat: Co-authored commit for badge"
# Ensure the co-authored-by trailer is correctly formatted
git commit -m "$msg`n`nCo-authored-by: $coAuthorName <$coAuthorEmail>"

Write-Host "Pushing branch..."
git push origin $branchName

Write-Host "---------------------------------------------------"
Write-Host "DONE! Now go to GitHub:"
Write-Host "1. Create a Pull Request for '$branchName'."
Write-Host "2. Merge the Pull Request."
Write-Host "   (This should trigger the 'Pair Extraordinaire' badge)"
Write-Host "---------------------------------------------------"

git checkout main
