# Kai's Enhancements — Autodetailing Website

Production: 
![minimal-reproduce-example](https://i.imgur.com/3PYNGUz.png)

This is the marketing website for Kai's Enhancements (autodetailing). Built with Next.js App Router, TypeScript, and Tailwind, with centralized business info and SEO metadata.

## Tech stack
- Next.js 14 (App Router)
- React 18, TypeScript
- Tailwind CSS (+ tailwind-merge)
- ESLint 9, Prettier 3

## Quick start
```bash
# 1) Install dependencies
pnpm i

# 2) Start dev server
pnpm dev

# 3) Build for production
pnpm build

# 4) Start production server
pnpm start
```

## Scripts
- `pnpm dev`: run local development server
- `pnpm build`: build production bundle
- `pnpm start`: start the production server
- `pnpm lint`: run ESLint

## Environment variables
Create a `.env.local` with:
```
NEXT_PUBLIC_PRODUCTION_URL=https://kais-autodetailing.com
```
This value is used by `app/robots.ts` and `app/sitemap.ts` to generate absolute URLs.

## Deployment
Recommended: Vercel
1) Set `NEXT_PUBLIC_PRODUCTION_URL` in project settings
2) Deploy from the `production` branch
3) Ensure required images exist in `public/` paths referenced by the UI
