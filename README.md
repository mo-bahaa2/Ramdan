# Ramadan Stories — React migration

This project is a migration of the original static HTML/JS app into a small Vite + React app.

Quick start:

1. Copy your existing images folder (`img/`) at project root (it already exists in this workspace).
2. Create a `.env` file based on `.env.example` and set your `VITE_YT_KEY` (YouTube API key) and optionally `VITE_API_BASE`.

Commands:

```bash
npm install
npm run dev
```

Notes:

- Prayer timings use `VITE_API_BASE` if set, otherwise default to `https://api.aladhan.com/v1`.
- YouTube playlist fetching requires `VITE_YT_KEY`.
