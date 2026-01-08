# Fix: Missing seed:admin Script on VPS

## Problem
The VPS doesn't have the latest code with the `seed:admin` script.

## Solution: Pull Latest Code

Run these commands on your VPS:

```bash
# 1. Navigate to project root (not backend)
cd /root/fun

# 2. Check for uncommitted changes
git status

# 3. If there are changes, stash them
git stash

# 4. Pull latest code from GitHub
git pull origin main

# 5. Go to backend
cd backend

# 6. Now run the seed script
npm run seed:admin
```

## Alternative: If git pull fails

```bash
# Force pull (discards local changes)
cd /root/fun
git fetch origin
git reset --hard origin/main
cd backend
npm run seed:admin
```

## Verify package.json has the script

```bash
cd /root/fun/backend
cat package.json | grep seed
```

You should see:
```json
"seed:admin": "node src/scripts/seedAdmin.js"
```

