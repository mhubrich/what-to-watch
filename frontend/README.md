# Frontend

## Brief Summary
This directory contains the modernized, robust React frontend application built with Vite and TypeScript. It replaces the legacy Vanilla JavaScript Single Page Application (SPA).

## Architecture & Technologies
- **Vite:** High-performance local development server and optimized build tool.
- **React 19 (TSX):** Component-based architecture with robust type-safety provided by TypeScript.
- **React Router v7:** Client-side routing for seamless transitions between authenticated dashboard and public login.
- **React Query:** Powerful data-fetching, caching, and background synchronization.
- **Tailwind CSS v4 & Radix UI:** Extremely fast styling utilizing atomic CSS classes and headless, fully-accessible primitive UI components.

## Development Commands

Navigate into the `frontend/` directory before running these commands:

- `npm install`: Install dependencies.
- `npm run dev`: Boot the local development server (typically at `http://localhost:5173`).
- `npm run build`: Generate optimized static files in the `/dist` output directory for S3 deployment.
- `npm run test`: Run Vitest unit & component tests.
- `npx playwright test`: Execute end-to-end (E2E) core user flow tests.

## Deployment Operations
The generated `/dist` folder inherently serves as the static layer for deployment. Simply sync the `/dist` contents with the AWS S3 static website hosting bucket.
