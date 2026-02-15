# Generate Cross Activity
# Creates Issues and Pull Requests to populate the "Issues" and "Pull requests" axes.
# Requires 'gh' CLI authentication.

Param(
    [int]$Count = 50
)

# Check for gh CLI
$ghPath = "C:\Program Files\GitHub CLI\gh.exe"
if (-not (Test-Path $ghPath)) {
    Write-Error "GitHub CLI (gh) is not installed at '$ghPath'."
    exit 1
}

# Check authentication
$authStatus = & $ghPath auth status 2>&1
if ($authStatus -match "You are not logged into any GitHub hosts") {
    Write-Warning "You are not logged in to GitHub CLI."
    Write-Host "Please run 'gh auth login' to authenticate."
    exit 1
}

$branchBase = "feature/cross-activity-"
$issueTitleBase = "Cross Activity Issue #"
$prTitleBase = "Cross Activity PR #"

Write-Host "Generating $Count Issues and $Count PRs..."

for ($i = 1; $i -le $Count; $i++) {
    $suffix = Get-Random
    
    # 1. Create Issue
    Write-Host "Creating Issue $i..."
    & $ghPath issue create --title "$issueTitleBase$i ($suffix)" --body "This is an automated issue for activity generation."
    
    # 2. Create Branch & Commit
    $branchName = "$branchBase$suffix"
    git checkout -b $branchName
    
    $date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path "activity_log.txt" -Value "[$date] Cross Activity $i"
    git add activity_log.txt
    git commit -m "chore: Activity bump $i"
    git push origin $branchName
    
    # 3. Create PR (linked to Issue if possible, but keeping it simple)
    Write-Host "Creating PR $i..."
    & $ghPath pr create --title "$prTitleBase$i ($suffix)" --body "Automated PR for activity generation." --base main
    
    # 4. Merge PR (Simulate Code Review/Merge activity)
    Write-Host "Merging PR $i..."
    & $ghPath pr merge --merge --delete-branch
    
    git checkout main
    git pull origin main
    
    Write-Host "--------------------------------"
}

Write-Host "Done! Check your contribution graph for 'Issues' and 'Pull requests' activity."
