# human_commits_v3.ps1 - Dense, natural-looking GitHub graph
# Strategy: consistent activity across ALL months, with only small natural dips.
# No large vacation blackouts. Sick days rare. Every weekday has a high chance of commits.

$repoPath = "c:\Users\Lenovo\lumina_stay"
$email    = "celestinhakorimana25@gmail.com"
$name     = "Celestin25"
$daysBack = 365
$branch   = "main"

Set-Location $repoPath
git checkout $branch 2>&1 | Out-Null
git config user.email $email
git config user.name  $name

#------------------------------------------------------------
# Dynamic message builder
#------------------------------------------------------------

$featVerbs   = @("add","implement","introduce","build","create","integrate","wire up","scaffold","set up","enable","ship")
$featTargets = @(
    "property search filters","booking confirmation modal","date range picker",
    "guest count selector","wishlist feature","map view for listings",
    "host earnings dashboard","promo code at checkout","review submission form",
    "photo gallery carousel","real-time availability check","price breakdown panel",
    "cancel booking flow","messaging between host and guest",
    "saved searches page","notification preferences","OAuth login with Google",
    "admin property approval flow","bulk photo upload","password strength indicator",
    "booking history timeline","auto-complete for location input","share listing via link",
    "invite co-host feature","property availability calendar sync",
    "host response time display","verified host badge","instant book toggle",
    "multi-step onboarding flow","report listing modal","accessibility improvements to nav",
    "keyboard navigation for date picker","breadcrumb trail to property detail"
)

$fixVerbs    = @("fix","resolve","patch","correct","repair","handle","prevent","address","guard against","eliminate")
$fixTargets  = @(
    "broken image links on property card","price calculation with discount codes",
    "null reference on guest profile page","date validation edge case in booking",
    "payment gateway silent timeout","mobile nav not closing on tap",
    "search results not refreshing after filter clear","500 on empty review body",
    "past date blocking in calendar widget","duplicate booking race condition",
    "footer links broken on Safari iOS","pagination not reflecting URL params",
    "profile changes reverting on page refresh","session expiry not redirecting",
    "admin dashboard crash on empty dataset","map markers overlapping at low zoom",
    "rating stars not saving on mobile","checkout total rounding error",
    "hydration mismatch in auth page","token not refreshing on expiry",
    "missing loading state on booking submit","stale data after filter change",
    "incorrect currency symbol for EUR users","z-index conflict in modal overlay",
    "flash of unstyled content on dark mode toggle","search bar losing focus mid-type",
    "icon misalignment in property card grid","overlapping labels on mobile calendar"
)

$refactorVerbs   = @("refactor","extract","split","simplify","consolidate","rewrite","reorganize","clean up","decouple","migrate","move")
$refactorTargets = @(
    "BookingForm into sub-components","auth logic into a custom hook",
    "API fetch utilities into a shared module","PropertyCard into a reusable atom",
    "state management in the search page","payment service from monolith",
    "legacy class components to functional","error boundaries into a HOC",
    "hardcoded strings into i18n keys","listing page data fetching to SWR",
    "date formatting helpers into utils","admin panel routing structure",
    "repeated API calls into a cache layer","CSS-in-JS to CSS modules in nav",
    "inline styles to design tokens","booking flow into a step machine",
    "user service into smaller responsibilities","listing service API layer",
    "map component to use useRef correctly","context providers into a single file"
)

$choreVerbs    = @("update","bump","upgrade","pin","remove","clean up","sync","configure","add","enable","enforce")
$choreTargets  = @(
    "Next.js to 14.2","axios to 1.7","eslint config for stricter rules",
    "unused dependencies from package.json",".env.example with new Stripe keys",
    "Prettier formatting across codebase","Husky pre-commit hooks",
    "GitHub Actions CI pipeline","TypeScript strict mode","Sentry error tracking",
    "Tailwind purge configuration","Docker Compose for local dev",
    "README with updated setup instructions","node version to 20 LTS",
    "PostCSS config","lint-staged for faster CI","package lock for reproducible builds",
    "renovate bot for dependency updates","Vercel environment variables",
    "gitignore to exclude local overrides"
)

$styleVerbs    = @("fix","improve","polish","tighten","adjust","update","clean up","standardize")
$styleTargets  = @(
    "spacing on mobile property grid","button hover and focus states",
    "loading skeleton animation timing","form label alignment across pages",
    "dark mode contrast in navbar","responsive layout at 768px breakpoint",
    "hero section typography on landing page","card shadow depth in listing grid",
    "icon sizing in the booking summary","tab indicator animation in profile",
    "footer column alignment on desktop","dropdown menu border radius",
    "toast notification position on mobile","chip component in filter bar",
    "avatar fallback initials sizing","map control button placement"
)

$perfVerbs     = @("optimize","improve","reduce","memoize","lazy-load","cache","debounce","throttle","preload","defer")
$perfTargets   = @(
    "property image loading with blur placeholder","expensive search re-renders",
    "redundant API calls with SWR deduplication","bundle size with dynamic imports",
    "search input with 300ms debounce","map re-renders on pan","font loading strategy",
    "initial page load by deferring analytics","LCP by preloading hero image",
    "admin table rendering with virtualization","CSV export by streaming data"
)

$docsVerbs     = @("document","add JSDoc to","update docs for","add comments to","write README for","annotate","clarify")
$docsTargets   = @(
    "booking API endpoints","payment flow architecture","model training pipeline",
    "authentication middleware","environment variable requirements",
    "database schema design decisions","admin access control logic",
    "property ranking algorithm","webhook event handling","rate limiting strategy"
)

$testVerbs     = @("add tests for","cover edge cases in","fix flaky test in","write unit tests for","add integration test for","improve coverage of")
$testTargets   = @(
    "booking date validation logic","price calculation service","auth token refresh flow",
    "property search ranking","review submission endpoint","user registration flow",
    "cancel booking edge cases","host payout calculation",
    "photo upload error handling","promo code validation logic"
)

function RandMsg($verbs, $targets) {
    $v = $verbs[(Get-Random -Maximum $verbs.Count)]
    $t = $targets[(Get-Random -Maximum $targets.Count)]
    return "$v $t"
}

function PickMessage {
    $roll = Get-Random -Minimum 1 -Maximum 100
    if      ($roll -le 28) { return "fix: "      + (RandMsg $fixVerbs $fixTargets) }
    elseif  ($roll -le 52) { return "feat: "     + (RandMsg $featVerbs $featTargets) }
    elseif  ($roll -le 65) { return "refactor: " + (RandMsg $refactorVerbs $refactorTargets) }
    elseif  ($roll -le 77) { return "chore: "    + (RandMsg $choreVerbs $choreTargets) }
    elseif  ($roll -le 86) { return "style: "    + (RandMsg $styleVerbs $styleTargets) }
    elseif  ($roll -le 92) { return "perf: "     + (RandMsg $perfVerbs $perfTargets) }
    elseif  ($roll -le 97) { return "test: "     + (RandMsg $testVerbs $testTargets) }
    else                   { return "docs: "     + (RandMsg $docsVerbs $docsTargets) }
}

#------------------------------------------------------------
# Time helpers
#------------------------------------------------------------
function GetHour($session) {
    if     ($session -eq "earlymorning") { return Get-Random -Minimum 7  -Maximum 9  }
    elseif ($session -eq "morning")      { return Get-Random -Minimum 9  -Maximum 12 }
    elseif ($session -eq "lunch")        { return Get-Random -Minimum 12 -Maximum 14 }
    elseif ($session -eq "afternoon")    { return Get-Random -Minimum 14 -Maximum 18 }
    elseif ($session -eq "evening")      { return Get-Random -Minimum 18 -Maximum 21 }
    elseif ($session -eq "latenight")    { return Get-Random -Minimum 21 -Maximum 23 }
    else                                 { return Get-Random -Minimum 9  -Maximum 17 }
}

#------------------------------------------------------------
# Log file
#------------------------------------------------------------
$logFile = Join-Path $repoPath "dev_log.txt"
if (-not (Test-Path $logFile)) {
    New-Item -ItemType File -Path $logFile | Out-Null
}

#------------------------------------------------------------
# Short natural "off" periods — max 3 blocks, max 4 days each
# These are spread across the year but small enough to not create dead months
#------------------------------------------------------------
$offDays = @{}

# Block 1: Short break around day 60-100 (spring break)
$b1Start = Get-Random -Minimum 60 -Maximum 95
$b1Len   = Get-Random -Minimum 2 -Maximum 5
for ($d = $b1Start; $d -lt ($b1Start + $b1Len); $d++) { $offDays[$d] = $true }

# Block 2: Short break in summer, day 180-220
$b2Start = Get-Random -Minimum 175 -Maximum 215
$b2Len   = Get-Random -Minimum 2 -Maximum 5
for ($d = $b2Start; $d -lt ($b2Start + $b2Len); $d++) { $offDays[$d] = $true }

# Block 3: Holiday season, day 300-320
$b3Start = Get-Random -Minimum 298 -Maximum 318
$b3Len   = Get-Random -Minimum 2 -Maximum 4
for ($d = $b3Start; $d -lt ($b3Start + $b3Len); $d++) { $offDays[$d] = $true }

#------------------------------------------------------------
# Main loop
#------------------------------------------------------------
Write-Host "Building 365 days of dense, natural-looking commit history..." -ForegroundColor Cyan

$startDate   = (Get-Date).AddDays(-$daysBack)
$commitCount = 0
$daysDone    = 0

for ($i = 0; $i -lt $daysBack; $i++) {
    $currentDate = $startDate.AddDays($i)
    $dow         = $currentDate.DayOfWeek

    # Skip Sundays
    if ($dow -eq "Sunday") { continue }

    # Saturdays: 20% chance (slightly higher than before for more natural density)
    if ($dow -eq "Saturday") {
        if ((Get-Random -Minimum 1 -Maximum 100) -gt 20) { continue }
    }

    # Short off-period blocks
    if ($offDays.ContainsKey($i)) { continue }

    # Rare sick day on weekdays: only 7% chance (was 15% before)
    if ($dow -ne "Saturday" -and (Get-Random -Minimum 1 -Maximum 100) -le 7) { continue }

    # ---- Decide day type ----
    $dayRoll = Get-Random -Minimum 1 -Maximum 100

    # Light day (15%): 2-4 commits
    if ($dayRoll -le 15) {
        $numCommits = Get-Random -Minimum 2 -Maximum 5
        $sessions   = @("morning")

    # Normal weekday (45%): 4-8 commits across 2 sessions
    } elseif ($dayRoll -le 60) {
        $numCommits = Get-Random -Minimum 4 -Maximum 9
        $sessions   = @("morning", "afternoon")

    # Productive day (30%): 8-14 commits
    } elseif ($dayRoll -le 90) {
        $numCommits = Get-Random -Minimum 8 -Maximum 15
        $sessions   = @("earlymorning", "morning", "afternoon", "evening")

    # Crunch day (10%): 12-20 commits
    } else {
        $numCommits = Get-Random -Minimum 12 -Maximum 21
        $sessions   = @("morning", "afternoon", "evening", "latenight")
    }

    # Saturday override: max 5 commits and only afternoon/evening
    if ($dow -eq "Saturday") {
        $numCommits = Get-Random -Minimum 1 -Maximum 6
        $sessions   = @("afternoon", "evening")
    }

    # ---- Generate commits ----
    $usedMessages = @{}
    for ($j = 0; $j -lt $numCommits; $j++) {

        $session  = $sessions[$j % $sessions.Count]
        $hour     = GetHour $session
        $minute   = Get-Random -Minimum 0 -Maximum 59
        $second   = Get-Random -Minimum 0 -Maximum 59
        $gapMins  = Get-Random -Minimum 3 -Maximum 41

        $commitDT = $currentDate.Date.AddHours($hour).AddMinutes($minute + $gapMins).AddSeconds($second)

        # Clamp to same day
        if ($commitDT.Day -ne $currentDate.Day) {
            $commitDT = $currentDate.Date.AddHours(23).AddMinutes(45).AddSeconds($second)
        }

        $dateStr = $commitDT.ToString("yyyy-MM-ddTHH:mm:ss")

        # Unique message
        $attempts = 0
        do {
            $msg = PickMessage
            $attempts++
        } while ($usedMessages.ContainsKey($msg) -and $attempts -lt 40)
        $usedMessages[$msg] = $true

        # Write to log to force a diff
        Add-Content -Path $logFile -Value "[$dateStr] $msg"
        git add $logFile

        $env:GIT_AUTHOR_DATE     = $dateStr
        $env:GIT_COMMITTER_DATE  = $dateStr
        $env:GIT_AUTHOR_NAME     = $name
        $env:GIT_AUTHOR_EMAIL    = $email
        $env:GIT_COMMITTER_NAME  = $name
        $env:GIT_COMMITTER_EMAIL = $email

        git commit -m $msg | Out-Null
        $commitCount++
    }

    $daysDone++
    if ($daysDone % 20 -eq 0) {
        Write-Host "  $($currentDate.ToString('ddd yyyy-MM-dd'))  ->  $numCommits commits  (total: $commitCount)" -ForegroundColor Green
    }
}

# ---- Cleanup ----
$envVars = @(
    "GIT_AUTHOR_DATE","GIT_COMMITTER_DATE",
    "GIT_AUTHOR_NAME","GIT_AUTHOR_EMAIL",
    "GIT_COMMITTER_NAME","GIT_COMMITTER_EMAIL"
)
foreach ($ev in $envVars) {
    Remove-Item "Env:\$ev" -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "Done! $commitCount commits across $daysDone active days." -ForegroundColor Cyan
Write-Host "Sample of last 20 commits:"
git log -n 20 --format="%h  %ad  %s" --date=short
