$messages = @(
    "Refactoring the fabric of reality",
    "Teaching the AI to love",
    "Fixed a bug that didn't exist",
    "Optimized the optimization",
    "Deleting production database... just kidding",
    "Adding more chaos",
    "Trying to exit vim",
    "Coffee driven development",
    "Git blame someone else",
    "Pushing to production on Friday",
    "Consulting stackoverflow...",
    "Copy pasting from internet",
    "It works on my machine",
    "Removing all comments",
    "Adding more comments",
    "Turning it off and on again",
    "Hacking the mainframe",
    "Downloading more RAM",
    "Compiling...",
    "Merge conflict resolution: Coin toss"
)

Write-Host "Starting the chaos engine..."

for ($i = 1; $i -le 100; $i++) {
    $randomMsg = $messages[(Get-Random -Maximum $messages.Length)]
    $commitMsg = "feat: $randomMsg (Chaos #$i)"
    
    # Ensure unique content to force a commit
    $date = Get-Date -Format "yyyy-MM-dd HH:mm:ss.fff"
    $logEntry = "[$date] $randomMsg"
    Add-Content -Path "activity_log.txt" -Value $logEntry
    
    git add activity_log.txt
    git commit -m "$commitMsg"
    
    if ($i % 10 -eq 0) {
        Write-Host "Committed $i/100"
    }
}

Write-Host "Done! 100 commits generated."
Write-Host "Run 'git push' to unleash the chaos."
