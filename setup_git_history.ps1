
# Reset to ensure we start clean (assuming we are at the initial single commit or mixed state)
# We want to unstage everything first if it's already staged
git reset

# 1. Config
git add package.json package-lock.json tsconfig.json next.config.ts eslint.config.mjs .gitignore
git commit -m "chore: Initial project configuration"

# 2. Env
git add .env
git commit -m "chore: Add environment variables example"

# 3. Prisma Schema
git add prisma/schema.prisma
git commit -m "db: Define Prisma schema with SQLite"

# 4. Migrations
git add prisma/migrations
git commit -m "db: Init migrations"

# 5. Seeds
git add prisma/seed.ts prisma/seed.js
git commit -m "db: Add seeding scripts"

# 6. Libs
git add src/lib/
git commit -m "feat: Add Prisma singleton and utils"

# 7. Global Styles
git add src/app/globals.css
git commit -m "ui: Add global luxury theme styles"

# 8. Navbar
git add src/components/Navbar.tsx src/components/Navbar.module.css
git commit -m "feat: Create responsive Navbar component"

# 9. Footer
git add src/components/Footer.tsx src/components/Footer.module.css
git commit -m "feat: Create Footer component"

# 10. ModelCard
git add src/components/ModelCard.tsx src/components/ModelCard.module.css
git commit -m "feat: Create ModelCard component"

# 11. Layout
git add src/app/layout.tsx
git commit -m "feat: Setup RootLayout with fonts and structure"

# 12. Landing Page
git add src/app/page.tsx src/app/page.module.css
git commit -m "feat: Implement Landing Page with featured models"

# 13. Search Page
git add src/app/search/
git commit -m "feat: Implement Search Page with filters"

# 14. Model Profile
git add src/app/models/
git commit -m "feat: Implement dynamic Model Profile page"

# 15. Auth Config
git add src/auth.ts src/app/api/auth/
git commit -m "auth: Config Auth.js with credentials provider"

# 16. Server Actions
git add src/actions/
git commit -m "auth: Add Server Actions for login and registration"

# 17. Register Page
git add src/app/register/
git commit -m "feat: Implement Registration page"

# 18. Login Page
git add src/app/login/
git commit -m "feat: Implement Login page"

# 19. API Routes
git add src/app/api/models/
git commit -m "api: Add models API route"

# 20. Static Pages
git add src/app/about/ src/app/locations/
git commit -m "feat: Add About and Locations pages"

# 21. Docs and cleanup
git add README.md
git commit -m "docs: Add README documentation"

# Final catch-all
git add .
git commit -m "chore: Finalize project structure and artifacts"

Write-Host "Commits created successfully!"
