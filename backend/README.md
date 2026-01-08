# AHRF Backend

MERN backend with JWT authentication.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ahrf-saas
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```

3. Create Super Admin (First time setup):
```bash
npm run seed:admin
```

This will create a Super Admin with default credentials:
- **Email:** `admin@ahrf-saas.com`
- **Password:** `Ahrf@2024!Secure`

**For Production:** Set custom credentials in `.env`:
```env
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_NAME=Your Admin Name
```

⚠️ **IMPORTANT:** Change the password immediately after first login!

4. Start server:
```bash
npm run dev
```

## API Routes

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/users` - Get all users (SUPER_ADMIN, RESELLER)
- `GET /api/users/:id` - Get user (SUPER_ADMIN, RESELLER)
- `POST /api/users` - Create user (SUPER_ADMIN, RESELLER)
- `PUT /api/users/:id` - Update user (SUPER_ADMIN, RESELLER)
- `DELETE /api/users/:id` - Delete user (SUPER_ADMIN)

