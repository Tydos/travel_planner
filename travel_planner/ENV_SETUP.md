# Environment Variables Setup

## Frontend .env File

I've created a `.env` file in the `travel_planner` folder. 

### ⚠️ IMPORTANT: You need to add your Google Client ID

1. Open the `.env` file
2. Replace `your-client-id.apps.googleusercontent.com` with your actual Google Client ID
3. Save the file
4. **Restart your dev server** (stop and run `npm run dev` again)

### Example:
```
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

### Why restart?
Vite only reads `.env` files when the dev server starts. After creating or modifying `.env`, you must restart.

### Verify it's working:
1. Check browser console - should NOT see the error message
2. The "Sign in with Google" button should appear in the header
3. No "Google OAuth Not Configured" warning

### Troubleshooting:
- ✅ File must be named exactly `.env` (not `.env.txt` or `env`)
- ✅ File must be in the `travel_planner` folder (same level as `package.json`)
- ✅ Must start with `VITE_` prefix for Vite to read it
- ✅ No spaces around the `=` sign
- ✅ Restart dev server after changes

