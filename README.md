# FelixChef App

Angular application for publishing recipes with support for:

- public recipe listing
- recipe pagination
- ingredient filtering
- recipe sorting
- private author authentication
- create/edit recipes with YouTube video, ingredients and description
- Supabase backend
- Centralized UI text management for easy internationalization
- Custom branding with chef emoji favicon

---

## Recent Updates

- **Internationalization Ready**: All UI text strings are now centralized in `src/app/i18n/texts.ts` for easier maintenance and future multi-language support.

---

## Stack

- Angular 18
- Tailwind CSS
- Supabase JS
- Supabase Auth + Postgres
- Karma / Jasmine for tests

---

## Requirements

- Node.js 20+ or compatible
- npm
- Supabase project with API + Auth

---

## Local setup

```bash
npm install
```

### Configure environment variables

1. Copy the example file:

```bash
cp .env.example .env
```

2. Fill in your real values in `.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

3. Start the app:

```bash
npm start
```

> The project uses `scripts/generate-env.js` to generate `public/env.js` automatically before start, build, or test.

---

## Required env variables

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### Important

- `SUPABASE_ANON_KEY` is the public client key used by the frontend.
- Never commit private keys or service role keys to the repository.

---

## Supabase configuration

1. Create a Supabase project.
2. Import the SQL files in `supabase/`:
   - `supabase/recipes.sql`
   - `supabase/ingredients_and_recipe_details.sql`
   - `supabase/admin_crud_policies.sql`
3. Configure Auth and row-level policies as needed.

> If Supabase is not configured correctly, the app stays in a safe mode and does not initialize the Supabase client.

---

## Available scripts

- `npm start` - run the app in development
- `npm run build` - generate production build
- `npm run watch` - run build in watch mode
- `npm test` - run Karma tests

---

## Deploying to Vercel

To deploy on Vercel:

1. Create a Vercel project and connect your repository.
2. Configure environment variables in Vercel dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. Ensure Vercel performs a standard Angular build.

> The build process will automatically generate `public/env.js` from the Vercel environment variables. No `.env` file is needed in the repository for production deployment.

---

## Key repository structure

- `src/app/features/recipes/pages/home-page/` - public recipe home page
- `src/app/features/admin/pages/admin-page/` - admin panel for recipe creation and editing
- `src/app/i18n/texts.ts` - centralized UI text strings for internationalization
- `src/app/core/supabase.service.ts` - Supabase initialization and validation
- `src/environments/` - environment configuration
- `public/env.js` - generated from `.env`
- `supabase/` - SQL schema and policies

---

## Additional notes

- `public/env.js` should not be edited manually long-term: it is generated automatically from `.env` (local) or environment variables (production).
- If you change `.env`, restart `npm start` or rebuild the app.
- In production (Vercel), the app reads `window.env` at runtime from `public/env.js`, which is generated during the build process from Vercel environment variables.
