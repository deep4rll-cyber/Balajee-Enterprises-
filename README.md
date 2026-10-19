# Balajee Enterprises website

Hindi-first responsive React + Vite website for Balajee Enterprises, Koderma/Barkattha, Jharkhand. Includes a product catalog, quote requests, WhatsApp enquiry links, material estimator, brand comparison, speech playback, construction news cards, and a Firebase-ready admin area.

## Run locally

1. Install Node.js 20+.
2. In this folder run:
   ```bash
   npm install
   npm run dev
   ```
3. Open the local URL printed by Vite.

The site works as a demo without Firebase. Product and news data are sample data and rates are intentionally shown as “भाव पूछें” rather than invented live prices.

## Firebase setup

1. Create a Firebase project and enable **Authentication → Email/Password** and **Cloud Firestore**.
2. Copy `.env.example` to `.env.local`, and fill in your web app config.
3. In Firebase Authentication, create the admin user.
4. In Firestore, create `admins/{ADMIN_UID}` for that user. Only allowlisted admins can edit catalog/news.
5. Deploy rules: `firebase deploy --only firestore:rules`.
6. For public lead submission, implement a Cloud Function (or a server endpoint protected by Firebase App Check and rate limiting). The included Firestore rules intentionally block unauthenticated direct writes to `leads`.
7. Run `npm run build` and deploy with `firebase deploy --only hosting`.

## Admin

Visit `/admin-login`. The admin route uses Firebase email/password authentication when configured. If Firebase is not configured, it displays a setup notice rather than pretending authentication is secure. For an authenticated user, the app checks the `admins/{uid}` allowlist document.

## Important before going live

- Replace demo contact details and WhatsApp number with the dealership's verified details.
- Verify product availability, prices, GST wording, technical specifications, news sources, and delivery claims.
- This starter does not implement credit issuance, loyalty balances, Google Analytics dashboards, RSS ingestion, or trusted public lead storage. Add these through server-side Firebase Functions and proper authorization before collecting customer data.
- The material calculator is a planning estimate only, not a structural design. Final quantities should be confirmed by a qualified engineer/site supervisor.
