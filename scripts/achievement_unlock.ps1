# Unlock Pair Extraordinaire Achievement
# Creates a commit with a co-author using the GitHub Actions bot email.

$coAuthorName = "github-actions[bot]"
$coAuthorEmail = "41898282+github-actions[bot]@users.noreply.github.com"
$msg = "feat: Official collaboration commit for Pair Extraordinaire"

Write-Host "Creating a co-authored commit with GitHub Actions bot..."

$date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path "activity_log.txt" -Value "[$date] Co-authored commit with bot"
git add activity_log.txt

# The Co-authored-by trailer must be at the end of the commit message with a blank line before it.
git commit -m "$msg`n`nCo-authored-by: $coAuthorName <$coAuthorEmail>"

Write-Host "Commit created. Push to GitHub to unlock 'Pair Extraordinaire'."
