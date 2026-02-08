# Lumina - Elite Companionship Platform

Lumina is a high-end platform for connecting discerning clients with elite companions. Built with modern web technologies to ensure performance, aesthetics, and privacy.

## Features

- **Luxury Aesthetics**: Custom "Gold/Dark" theme with glassmorphism.
- **Model Discovery**: Filter models by country, city, and price.
- **Profiles**: Detailed model profiles with photo galleries and service lists.
- **Authentication**: Secure registration and login for Clients and Models (NextAuth.js).
- **Responsive Design**: Fully optimized for mobile and desktop.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules with CSS Variables
- **Database**: SQLite (Local Dev) / PostgreSQL (Production)
- **ORM**: Prisma
- **Auth**: NextAuth.js v5

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize Database:**
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
