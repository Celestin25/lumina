# Prepare for YOLO Achievement
# Creates a branch and pushes it so the user can merge it without review.

$branchName = "feature/yolo-achievement-$(Get-Random)"

Write-Host "Preparing branch '$branchName' for YOLO badge..."

git checkout -b $branchName

$date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path "activity_log.txt" -Value "[$date] YOLO Achievement preparation"
git add activity_log.txt
git commit -m "chore: Prepare for YOLO merge"

Write-Host "Pushing branch..."
git push origin $branchName

Write-Host "---------------------------------------------------"
Write-Host "DONE! Now go to GitHub:"
Write-Host "1. Create a Pull Request for '$branchName'."
Write-Host "2. Click 'Merge pull request' IMMEDIATELY."
Write-Host "3. DO NOT ask for review."
Write-Host "---------------------------------------------------"

git checkout main
