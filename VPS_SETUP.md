# VPS Setup Commands

## Step-by-Step Setup on Your VPS

### 1. Navigate to Project Directory
```bash
cd /path/to/your/project
# Or if you cloned it:
cd fun
```

### 2. Pull Latest Code from GitHub
```bash
git pull origin main
```

### 3. Navigate to Backend
```bash
cd backend
```

### 4. Install Dependencies (if not already installed)
```bash
npm install
```

### 5. Create/Update .env File
```bash
nano .env
```

Add these variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ahrf-saas
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d

# Optional: Custom Super Admin Credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_NAME=Super Administrator
```

Save and exit (Ctrl+X, then Y, then Enter)

### 6. Create Super Admin
```bash
npm run seed:admin
```

**Output will show:**
```
✅ Super Admin created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email: admin@ahrf-saas.com
🔑 Password: Ahrf@2024!Secure
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7. Start Backend Server
```bash
# For production (runs continuously)
npm start

# OR for development (with auto-reload)
npm run dev
```

### 8. (Optional) Run Backend in Background with PM2
```bash
# Install PM2 globally (one time)
npm install -g pm2

# Start server with PM2
pm2 start src/server.js --name ahrf-backend

# Save PM2 configuration
pm2 save

# Make PM2 start on system reboot
pm2 startup
```

---

## Quick One-Liner Setup (If Already Configured)

```bash
cd backend && git pull origin main && npm install && npm run seed:admin && npm start
```

---

## Verify Setup

1. **Check if Super Admin exists:**
   ```bash
   # Connect to MongoDB
   mongosh
   use ahrf-saas
   db['users-hrf'].find({ role: 'SUPER_ADMIN' })
   ```

2. **Test API:**
   ```bash
   curl http://localhost:5000/api/auth/login
   ```

3. **Login via Frontend:**
   - Open: `http://72.62.124.251:5000` (or your frontend URL)
   - Email: `admin@ahrf-saas.com` (or your custom email)
   - Password: `Ahrf@2024!Secure` (or your custom password)
   - Role: Select "Super Admin"

---

## Troubleshooting

- **"Super Admin already exists"**: Delete existing admin first or use different credentials
- **MongoDB connection error**: Ensure MongoDB is running (`sudo systemctl status mongod`)
- **Port already in use**: Change PORT in .env or kill process using port 5000
- **Permission denied**: Use `sudo` if needed or check file permissions

---

## Security Checklist

- ✅ Change default password after first login
- ✅ Use strong JWT_SECRET in production
- ✅ Set custom ADMIN_EMAIL and ADMIN_PASSWORD in .env
- ✅ Keep .env file secure (never commit to Git)
- ✅ Use PM2 or systemd to run server as service
- ✅ Configure firewall (allow port 5000 if needed)

