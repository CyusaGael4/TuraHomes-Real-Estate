# TuraHomes Real Estate

TuraHomes is a modern real estate web app built with React, Vite, Tailwind CSS, and Supabase. It supports public property browsing, property detail pages with map views, user authentication, and an agent-only dashboard for managing listings and inquiries.

## Overview

This project is the frontend for a Supabase-backed real estate system.

Main capabilities:

- Public home page with hero search and featured listings
- Listings page with filters and server-side querying
- Property detail page with image gallery, agent details, inquiry form, and Leaflet map
- Email/password authentication with Supabase Auth
- Role-aware access for regular users and agents
- Agent dashboard for managing listings and reviewing inquiries
- Property image uploads to Supabase Storage

## Tech Stack

- React 19
- Vite
- Tailwind CSS 4
- React Router
- Supabase JS
- React Leaflet + Leaflet
- Lucide React

## Project Structure

```text
src/
  assets/           Static images and background assets
  components/       Reusable UI components
  context/          Auth context and hooks
  lib/              Supabase client
  pages/            Route-level pages
  App.jsx           Route definitions and app shell
  main.jsx          App entry point
```

Important files:

- [src/lib/supabase.js](./src/lib/supabase.js): Supabase client setup
- [src/context/AuthContext.jsx](./src/context/AuthContext.jsx): auth session management
- [src/context/useAuth.js](./src/context/useAuth.js): auth hook
- [src/pages/Listings.jsx](./src/pages/Listings.jsx): server-filtered listings with pagination
- [src/pages/Dashboard.jsx](./src/pages/Dashboard.jsx): agent dashboard

## Supabase Setup

The backend is already expected to exist in Supabase.

Tables used:

- `users`
- `agents`
- `properties`
- `inquiries`

Other requirements:

- Supabase Auth enabled for email/password
- Storage bucket named `property-images`
- RLS policies configured

Expected behavior:

- If signup metadata contains `role = 'agent'`, the backend creates both a `users` and `agents` record
- Regular signup creates only a `users` record

## Environment Variables

Create a local `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These are read by Vite at build time.

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Lint the code:

```bash
npm run lint
```

## Current App Behavior

### Auth

- Auth state is stored with `supabase.auth.getSession()` and `onAuthStateChange`
- Agent access is determined by checking whether the signed-in user exists in the `agents` table
- Protected agent routes:
  - `/dashboard`
  - `/dashboard/new`
  - `/dashboard/edit/:id`

### Listings

- Listings are queried from Supabase with filters applied server-side
- Results are paginated to reduce browser memory use and improve scale
- Filters supported:
  - search
  - type
  - status
  - city
  - bedrooms
  - min price
  - max price

### Dashboard

- Agents can:
  - create listings
  - edit listings
  - delete listings
  - review inquiries on their properties

### Images

- Property images are uploaded to the `property-images` Supabase storage bucket
- Public URLs are stored in the `properties.images` array

## Deployment

This is a static frontend app. The easiest production deployment options are:

- Vercel
- Netlify

Supabase remains the backend.

### Option 1: Deploy to Vercel

1. Push the project to GitHub
2. Import the repository into Vercel
3. Set:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variables in the Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy

This repo includes a `vercel.json` rewrite so SPA routes like `/dashboard` and `/listings/123` work on refresh.

### Option 2: Deploy to Netlify

1. Push the project to GitHub
2. Import the repository into Netlify
3. Set:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy

This repo includes a `netlify.toml` redirect so client-side routes work correctly.

## Custom Domain

After deployment:

- Connect your domain in Vercel or Netlify
- Update DNS records as instructed by the host
- Use HTTPS

If you later use Supabase Auth email confirmations or OAuth redirects, add your production site URL to Supabase:

- Supabase Auth URL configuration
- Redirect URLs

## Production Checklist

Before going live, confirm:

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in production
- RLS policies are working correctly
- `property-images` bucket is public if public URLs are required
- Supabase Auth redirect/site URLs include your production domain
- Storage limits and database quotas are appropriate for expected traffic
- The app builds successfully with `npm run build`

## Scaling Notes

This frontend has already been improved to behave better under growth:

- Route-level code splitting is enabled
- Listings use server-side filtering instead of downloading the entire table
- Listings are paginated

For higher scale on the Supabase side, add or confirm indexes on heavily queried fields such as:

- `properties.created_at`
- `properties.city`
- `properties.type`
- `properties.status`
- `properties.price`
- `properties.bedrooms`
- `properties.agent_id`
- `inquiries.property_id`

## Recommended Hosting Setup

If you want the simplest path:

- Frontend: Vercel
- Backend: Supabase
- Domain: connect your custom domain to Vercel

Why this setup is good:

- Vite apps deploy easily
- preview deployments come for free
- environment variables are straightforward
- static asset hosting is fast
- no separate Node server is required for this frontend

## Handoff Notes For Another Developer

If you continue this project, likely next improvements are:

1. Add better loading and error states across all pages
2. Add form validation with clearer field-level messages
3. Compress large background images for faster first load
4. Add database indexes in Supabase for filter-heavy queries
5. Add analytics, SEO metadata, and sitemap support
6. Add test coverage for auth flows and route protection

## License

No license file is currently included. Add one before public distribution if needed.
