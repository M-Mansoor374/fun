# Super Admin Setup Guide

## Quick Setup (Production)

### Step 1: Set Environment Variables (Optional)

Add to your `.env` file for custom credentials:

```env
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_NAME=Super Administrator
```

If not set, default credentials will be used:
- **Email:** `admin@ahrf-saas.com`
- **Password:** `Ahrf@2024!Secure`

### Step 2: Run Seed Script

```bash
cd backend
npm run seed:admin
```

### Step 3: Login Credentials

After running the seed script, use these credentials to login:

**Default Credentials:**
- **Email:** `admin@ahrf-saas.com`
- **Password:** `Ahrf@2024!Secure`
- **Role:** Select "Super Admin" in the login form

**Or if you set custom credentials:**
- **Email:** (Your ADMIN_EMAIL from .env)
- **Password:** (Your ADMIN_PASSWORD from .env)
- **Role:** Select "Super Admin" in the login form

### Step 4: Change Password (IMPORTANT)

After first login, immediately change your password through the dashboard settings or update it in the database.

## Security Notes

1. **Never commit `.env` file** to version control
2. **Use strong passwords** in production (min 12 characters, mix of uppercase, lowercase, numbers, special chars)
3. **Change default password** immediately after first login
4. **Limit access** to the seed script in production

## Troubleshooting

- **"Super Admin already exists"**: A super admin is already created. Delete it from MongoDB or use different credentials.
- **Connection error**: Ensure MongoDB is running and MONGO_URI is correct in `.env`
- **Permission denied**: Ensure you have write access to the database

