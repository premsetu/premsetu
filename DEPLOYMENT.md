# PremSetu Deployment Guide

This project is ready to be deployed after you add your own production credentials.

## 1. MongoDB Atlas

- Create a MongoDB Atlas cluster
- Create a database user
- Add your backend host IP access, or allow `0.0.0.0/0` if you want Railway access from anywhere
- Copy the connection string into `MONGO_URI`

## 2. Cloudinary

- Create a Cloudinary account
- Copy `cloud_name`, `api_key`, and `api_secret`
- Add them to the backend environment

## 3. Railway Backend

- Create a Railway project
- Deploy from this repository root
- Railway config is already added in [`railway.toml`](C:\Users\ASUS\OneDrive\Desktop\Bicholiya\premsetu\railway.toml)
- Add the environment variables from [`server/.env.example`](C:\Users\ASUS\OneDrive\Desktop\Bicholiya\premsetu\server\.env.example)
- Make sure:
  - `NODE_ENV=production`
  - `ALLOW_IN_MEMORY_DB=false`
  - `ENABLE_DEMO_SEED=false`
  - `ALLOW_LOCAL_UPLOAD_FALLBACK=false`
- Railway will run the predeploy validation script before starting the backend
- The backend health check path is `/api/health`

## 4. Vercel Frontend

- Create a Vercel project
- Set the root directory to `client`
- Build command: `npm run build`
- Output directory: `build`
- Add `REACT_APP_API_URL=https://your-railway-backend-domain`
- The SPA rewrite file is already present in [`client/vercel.json`](C:\Users\ASUS\OneDrive\Desktop\Bicholiya\premsetu\client\vercel.json)

## 5. Connect Frontend and Backend

- Set `CLIENT_URL` on Railway to your Vercel production domain
- Set `CLIENT_URLS` on Railway if you want multiple allowed origins, for example:
  - `https://premsetu.vercel.app,https://*.vercel.app`

## 6. Final Checks Before Public Launch

- Replace the dev JWT secret with a long random value
- Remove any demo accounts from production data
- Upload and test real profile photos through Cloudinary
- Test login, profile edit, interest send, match creation, and realtime chat on production URLs
- Review Railway logs for CORS or upload issues after first deploy
- Run `npm run predeploy:check --prefix server` locally if you want to validate production env before pushing
