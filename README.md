# PremSetu

PremSetu is a premium matrimonial website built with React, Node.js, Express, MongoDB, and Cloudinary-ready uploads.

## What is already set up

- Full React frontend with routing, authentication, profile builder, match search, and chat
- Express backend with JWT auth, profile routes, match logic, and messaging
- Real-time chat using Socket.IO
- Production hardening for deployment:
  - Security headers with Helmet
  - API rate limiting
  - Input validation for auth, profile updates, and match filters
  - Health endpoint at `/api/health`
  - Production-safe environment validation at startup
- Zero-config local development fallback:
  - If `MONGO_URI` is missing, the server starts an in-memory MongoDB
  - If Cloudinary credentials are missing, uploaded images are stored as browser-safe data URLs for local testing
  - Demo users are auto-seeded only when `ENABLE_DEMO_SEED=true`

## Quick start

1. Open a terminal in `C:\Users\ASUS\OneDrive\Desktop\Bicholiya\premsetu`
2. Run `npm install`
3. Run `npm run install:all`
4. Run `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Demo logins

All demo accounts use the password `PremSetu@123`

- `rohan@premsetu.demo`
- `aditi@premsetu.demo`
- `arjun@premsetu.demo`
- `sneha@premsetu.demo`
- `karan@premsetu.demo`
- `priya@premsetu.demo`

Use `rohan@premsetu.demo` and `aditi@premsetu.demo` if you want to see an existing match and seeded chat messages immediately.

## Environment files

- Local dev backend config: [`server/.env`](C:\Users\ASUS\OneDrive\Desktop\Bicholiya\premsetu\server\.env)
- Local dev frontend config: [`client/.env`](C:\Users\ASUS\OneDrive\Desktop\Bicholiya\premsetu\client\.env)
- Production example backend config: [`server/.env.example`](C:\Users\ASUS\OneDrive\Desktop\Bicholiya\premsetu\server\.env.example)
- Production example frontend config: [`client/.env.example`](C:\Users\ASUS\OneDrive\Desktop\Bicholiya\premsetu\client\.env.example)

## Production deployment

For production:

- Set a real `MONGO_URI` from MongoDB Atlas
- Add real Cloudinary credentials
- Deploy the `client` app to Vercel
- Deploy the `server` app to Railway
- Set `REACT_APP_API_URL` in Vercel to your Railway backend URL
- Set `CLIENT_URL` in Railway to your Vercel frontend URL
- Follow the full checklist in [`DEPLOYMENT.md`](C:\Users\ASUS\OneDrive\Desktop\Bicholiya\premsetu\DEPLOYMENT.md)
- Railway config is already included in [`railway.toml`](C:\Users\ASUS\OneDrive\Desktop\Bicholiya\premsetu\railway.toml)
