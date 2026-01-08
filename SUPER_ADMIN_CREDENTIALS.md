# Super Admin Login Credentials

## Current Local Setup

**Existing Super Admin:**
- **Email:** `u@t.com`
- **Password:** (Unknown - you need to reset this or create a new admin)

## For VPS Production Setup

### Option 1: Use Default Credentials (Recommended for First Time)

1. **On your VPS**, navigate to the backend directory:
   ```bash
   cd backend
   ```

2. **Run the seed script:**
   ```bash
   npm run seed:admin
   ```

3. **Default credentials will be created:**
   - **Email:** `admin@ahrf-saas.com`
   - **Password:** `Ahrf@2024!Secure`
   - **Role:** Select "Super Admin" in login form

4. **Login URL:** `http://72.62.124.251:5000` (or your frontend URL)

### Option 2: Use Custom Credentials (Recommended for Production)

1. **On your VPS**, edit the `.env` file in the backend directory:
   ```env
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=YourSecurePassword123!
   ADMIN_NAME=Super Administrator
   ```

2. **Run the seed script:**
   ```bash
   npm run seed:admin
   ```

3. **Use your custom credentials to login**

## Login Instructions

1. Open your frontend application
2. Navigate to the login page
3. Enter credentials:
   - **Email:** (from above)
   - **Password:** (from above)
   - **Role:** Select "Super Admin" from dropdown
4. Click "Login"

## Security Checklist

- ✅ Change password immediately after first login
- ✅ Use strong password (12+ characters, mixed case, numbers, special chars)
- ✅ Never share credentials publicly
- ✅ Use environment variables for production credentials
- ✅ Keep `.env` file secure and never commit to Git

## Reset/Delete Existing Admin

If you need to reset the existing admin:

1. **Delete from MongoDB:**
   ```javascript
   // In MongoDB Compass or mongo shell
   use ahrf-saas
   db['users-hrf'].deleteOne({ role: 'SUPER_ADMIN' })
   ```

2. **Run seed script again:**
   ```bash
   npm run seed:admin
   ```

## Troubleshooting

- **Can't login?** Check that:
  - MongoDB is running
  - User exists in `users-hrf` collection
  - User role is exactly `SUPER_ADMIN`
  - User `isActive` is `true`
  - Password is correct

- **Script says "already exists"?** Delete the existing admin first (see above)

