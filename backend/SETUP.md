# TravelSphere Backend - Quick Start Guide

## Prerequisites

- Node.js v14+
- MongoDB (local or MongoDB Atlas)
- Git

## Installation Steps

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

Create `.env` file in the backend folder:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/travelsphere

JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key

FRONTEND_URL=http://localhost:8000
```

### Step 3: Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas** (cloud database - update MONGODB_URI in .env)

### Step 4: Seed Initial Data (Optional)

```bash
npm run seed
```

This creates initial package data in the database.

### Step 5: Start the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

✅ Server running on `http://localhost:5000`

## Testing the API

### 1. Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+9199999999",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the `token` from response.

### 3. Get All Packages

```bash
curl http://localhost:5000/api/packages
```

### 4. Create a Booking

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "packageId": "PACKAGE_ID",
    "numberOfTravelers": 2,
    "travelersDetails": [
      {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+9199999999",
        "age": 28
      }
    ],
    "departureDate": "2026-06-15",
    "specialRequests": "Window seat preferred"
  }'
```

## Connecting Frontend

Update your frontend config:

```javascript
// config.js or constants.js
export const API_URL = 'http://localhost:5000/api';
```

## Database Setup

### Option 1: Local MongoDB

Install MongoDB and start service:

```bash
# macOS
brew services start mongodb-community

# Windows
mongosh

# Linux
sudo systemctl start mongod
```

### Option 2: MongoDB Atlas (Recommended)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## File Structure

```
backend/
├── config/          # Configuration & seed data
├── controllers/     # Business logic
├── models/          # Database schemas
├── routes/          # API endpoints
├── middleware/      # Authentication & validation
├── utils/           # Helper functions
├── server.js        # Main entry point
├── package.json
├── .env             # Environment variables
└── README.md
```

## Admin Access

Create admin account by:

1. Register a normal user
2. Update role in MongoDB directly:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Or use admin endpoint after setting role.

## Payment Integration (Stripe)

### Get Stripe Keys

1. Sign up at https://stripe.com
2. Go to Dashboard > API Keys
3. Copy `Secret Key` and `Publishable Key`
4. Update `.env` file

### Test Payment

Use Stripe test card: `4242 4242 4242 4242`

## Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password
3. Use App Password in `.env` EMAIL_PASS

## Common Issues

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running

### JWT Token Error

```
Error: Invalid or expired token
```
**Solution:** Reset JWT_SECRET in .env

### CORS Error

```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Update FRONTEND_URL in .env

## Useful Commands

```bash
# Install specific package
npm install package-name

# Update packages
npm update

# Check outdated packages
npm outdated

# Run in development mode with logs
npm run dev

# Seed database with initial data
npm run seed

# Stop server
Ctrl + C
```

## Next Steps

1. ✅ Install backend
2. ✅ Configure environment
3. ✅ Set up database
4. ✅ Start server
5. Connect frontend to backend
6. Set up admin dashboard
7. Configure payment processing
8. Deploy to production

## Support

- Docs: See `README.md`
- Issues: Check error messages in console
- Contact: support@travelsphere.com

---

**Version:** 1.0.0
**Last Updated:** April 3, 2026
