// Load .env.local for scripts (Next does this itself for the app).
try {
  process.loadEnvFile(".env.local");
} catch {}
