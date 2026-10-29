# HAILANG

A premium refrigerator storefront built with React and Vite. The site presents the HAILANG collection, product features, and account entry points in a responsive design.

## Run the website

```bash
npm install
npm run dev
```

The Vite server prints the local address when it starts. Create a production bundle with `npm run build`.

## Local database on this computer

PostgreSQL 17 is configured locally for HAILANG on port `5433`; the database is `hailang`. Its private connection settings are in the ignored file `Backend/.env`. The database data is stored in the Windows user profile, outside the repository.

The backend API is running at `http://localhost:5000`. Start the frontend with `npm run dev` from the project root and sign in with `admin@example.com` / `admin123` for local development only.

After a computer restart, start the local database in PowerShell with:

```powershell
& 'C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe' -D "$env:LOCALAPPDATA\HAILANG\PostgreSQL\data" -l "$env:LOCALAPPDATA\HAILANG\PostgreSQL\postgres.log" -o "-p 5433 -h 127.0.0.1" start
```

Then start the API again with `npm run dev` from `Backend/`.

## Set up a fresh local database

If setting up on another computer, install Docker Desktop and start PostgreSQL from the project root:

```bash
docker compose up -d database
```

Copy `Backend/.env.example` to `Backend/.env`. It uses Docker's host port `5434`. Then run:

```bash
cd Backend
npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

In another terminal, run the frontend with `npm run dev`.

## Live login

GitHub Pages hosts only the frontend. To use login on the live website, deploy the Express backend and PostgreSQL database to a hosting service. Configure `NODE_ENV=production`, `DATABASE_URL`, `JWT_SECRET`, `REFRESH_SECRET`, and `CORS_ORIGIN` in that service. Set `CORS_ORIGIN` to the exact deployed website origin (for GitHub Pages, for example, `https://yhang1212.github.io`), then seed a secure administrator account.

Add a GitHub Actions repository variable named `VITE_API_URL` containing the public backend URL, without a trailing slash. The Pages workflow passes it into the frontend build. Push to `main` or rerun the Pages workflow after setting the variable.

Never deploy the local demo password or development secrets.

## Account authentication and provider sign-in

Copy the root `.env.example` to `.env.local` for the Vite app and set `VITE_API_URL` to the backend. Copy `Backend/.env.example` to `Backend/.env` and set the database URL and private server secrets. Do not commit either local env file.

Email/password registration is stored in PostgreSQL with bcrypt hashes. New accounts always receive the `USER` role. Email and Google registration share the existing HAILANG account session and customer role. Google sign-in is available on both login and registration once its client ID is configured. Password recovery remains unavailable until an outbound email provider is configured.

### Google sign-in setup

1. In Google Cloud Console, configure the OAuth consent screen and create an OAuth Client ID with application type **Web application**.
2. Add the development and deployed website origins under **Authorized JavaScript origins**, for example `http://localhost:5173`, `http://localhost:5174` (used if 5173 is occupied), and `https://yhang1212.github.io` (use your actual deployed origin if different).
3. Set the same Web client ID as `VITE_GOOGLE_CLIENT_ID` in root `.env.local` and `GOOGLE_CLIENT_ID` in `Backend/.env`. These are client identifiers, not client secrets. The `.env.example` files show the variable names; copy them to the ignored local env files and restart both services.
4. This implementation uses Google Identity Services popup mode and posts the ID token to the API for verification. It does not use a redirect callback, so no OAuth redirect URI is needed. Never put a Google client secret in Vite variables.

### Cambodia phone OTP setup

1. Create a Firebase project and register a web app. Set its web app values in the root env: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, and `VITE_FIREBASE_APP_ID`.
2. Enable **Phone** in Firebase Authentication, add the deployed website domain to Firebase Authentication's authorized domains, and enable the required SMS billing/quotas. Firebase's phone flow uses reCAPTCHA.
3. Create a Firebase service account for the backend and configure `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` only on the backend host. Store the private key as a protected secret; if entered as an environment variable, preserve escaped `\\n` line breaks. Do not place service-account credentials in the frontend or commit them.
4. The UI accepts Cambodia numbers using `+855`; Firebase manages OTP expiry and reCAPTCHA. The UI enforces a resend cooldown and the API rate-limits provider verification attempts. Firebase also applies its own abuse controls and quotas.
5. Set backend `CORS_ORIGIN` to the exact website origin. For GitHub Pages builds, add repository variables `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`, `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, and `VITE_FIREBASE_APP_ID`, then rebuild/deploy.

Provider buttons stay unavailable until both frontend and backend configuration are present. The API verifies Google ID tokens with `google-auth-library` and Firebase ID tokens with Firebase Admin before issuing HAILANG tokens. Test numbers in Firebase can be used for development without sending real SMS.

The backend now uses Firebase Admin, which requires Node.js 22 or newer on its hosting service.

The Firebase web `VITE_FIREBASE_PROJECT_ID` and backend `FIREBASE_PROJECT_ID` must refer to the same Firebase project.
