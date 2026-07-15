# Advertiser Onboarding Dashboard — Vercel Deployment

This is the fullthrottle.ai advertiser onboarding reconciliation dashboard,
adapted to run on Vercel. It's a static HTML page (`index.html`) plus one
serverless API route (`api/storage.js`) that gives every visitor a shared,
live-updating data store — replacing the Claude.ai-only `window.storage`
API used in the original artifact version.

## What changed from the Claude.ai version

The dashboard used to call `window.storage.get/set/delete`, which only
exists inside Claude.ai's artifact sandbox. This version calls
`/api/storage` instead, which is backed by **Vercel KV** (a hosted Redis
database). Everything else — Channel ID matching, the three-stage
pipeline (New Onboardings / Pending Script Install / Script Installed),
the HH (YDA)-based classification, the Script notes column, CSV/Excel
upload support, the password gate — works exactly the same.

## Files in this project

- `index.html` — the full dashboard (frontend)
- `api/storage.js` — serverless function backing the shared data store
- `package.json` — declares the one dependency (`@vercel/kv`)

## Setup steps

1. **Push this folder to a GitHub repo** (or deploy directly via the Vercel CLI).

2. **Import the project into Vercel** at vercel.com — pick "Other" as the
   framework preset (it's a static site + serverless functions, no build
   step needed).

3. **Add a Vercel KV database:**
   - In your Vercel project, go to the **Storage** tab
   - Click **Create Database → KV**
   - Once created, click **Connect Project** and select this project
   - This automatically sets the `KV_REST_API_URL` and `KV_REST_API_TOKEN`
     environment variables the API route needs — no manual config required

4. **Redeploy** the project (Vercel will prompt you to redeploy after
   connecting the KV database so the new environment variables take effect).

5. **Test it:**
   - Open the deployed URL — you should see the dashboard with empty states
     in all three sections
   - Click **Upload Files**, enter the password (`ProdOps`), and upload both
     files (CSV or Excel)
   - Open the same URL in a second browser/incognito window — it should
     show the same data within ~8 seconds (the live polling interval)

## Changing the upload password

The password is currently hardcoded in `index.html` as a client-side check
(search for `UPLOAD_PASSWORD`). This is a soft deterrent, not real
authentication — anyone who views the page source can find it. If you need
real access control later, that would mean checking the password
server-side in `api/storage.js` (or a dedicated auth route) instead.

## Local testing

You can run this locally with the Vercel CLI:

```bash
npm install
vercel dev
```

You'll still need a KV database connected (or `vercel env pull` after
connecting one in the dashboard) for uploads to persist locally.
