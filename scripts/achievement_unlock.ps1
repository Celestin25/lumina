# Unlock Pair Extraordinaire Achievement
# Creates a commit with a co-author.

$coAuthorName = "Jane Doe"
$coAuthorEmail = "jane.doe@example.com"
$msg = "feat: Collaboration commit to unlock achievement"

Write-Host "Creating a co-authored commit..."

$date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path "activity_log.txt" -Value "[$date] Co-authored commit"
git add activity_log.txt

# The Co-authored-by trailer must be at the end of the commit message with a blank line before it.
git commit -m "$msg`n`nCo-authored-by: $coAuthorName <$coAuthorEmail>"

Write-Host "Commit created. Push to GitHub to unlock 'Pair Extraordinaire'."
