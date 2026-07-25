# SentinelAI — Frontend

React + Vite single-page app for SentinelAI ("VirusTotal for AI agents").

This is the **frontend only**. It needs the SentinelAI backend running somewhere
(see the separate `sentinelai-backend` package) and pointed to via `VITE_API_URL`.

## Local development

```bash
cp .env.example .env      # set VITE_API_URL to your backend's URL
npm install
npm run dev
```

Visit http://localhost:5173

## Build for production

```bash
npm run build
```

Output goes to `dist/`.

## Deploying to Vercel

1. Import this repo/folder as a new Vercel project.
2. **Root Directory**: leave as `.` (this folder is already the frontend root).
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Install Command: `npm install`
6. **Environment Variables** → add `VITE_API_URL` = your deployed backend URL
   (e.g. `https://your-backend.onrender.com`)
7. Deploy.

`vercel.json` is already included — it rewrites all routes to `index.html` so
client-side routing (React Router) doesn't 404 on refresh/deep links.

## Deploying with Docker (alternative)

```bash
docker build -t sentinelai-frontend .
docker run -p 5173:80 sentinelai-frontend
```

This builds the app and serves it via nginx (see `Dockerfile` / `nginx.conf`).

## After deploying

Go to your backend's environment variables and set `FRONTEND_URL` to this
frontend's live URL — this is required for CORS and the Google OAuth redirect
to work correctly.
