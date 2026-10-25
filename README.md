# HAILANG

A premium refrigerator storefront built with React and Vite. The site presents the HAILANG collection, product features, and account entry points in a responsive design.

## Run the website

```bash
npm install
npm run dev
```

The Vite server prints the local address when it starts. Create a production bundle with `npm run build`.

## Backend

The Express and Prisma backend lives in `Backend/`. Copy `Backend/.env.example` to `Backend/.env`, configure `DATABASE_URL` for PostgreSQL, then run:

```bash
cd Backend
npm install
npx prisma migrate dev
npm run dev
```

The frontend defaults to `http://localhost:5000` for API calls. Set `VITE_API_URL` when the backend runs at a different address.

## Deployment

Pushing to `main` builds the Vite app and deploys the `dist/` bundle to GitHub Pages. The project base path is configured for the `Yhang` repository.
