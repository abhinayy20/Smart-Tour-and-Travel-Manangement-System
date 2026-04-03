# TravelSphere Backend API

Complete Node.js + Express backend for the TravelSphere travel booking platform with MongoDB, authentication, booking system, and payment integration.

## Features

✅ User Authentication (JWT)
✅ Package Management
✅ Booking System
✅ Payment Processing (Stripe Integration)
✅ Email Notifications
✅ Admin Dashboard
✅ User Profiles
✅ Revenue Analytics
✅ Role-Based Access Control

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)
- **Payment:** Stripe
- **Email:** Nodemailer
- **Password Hashing:** bcryptjs

## Installation

### 1. Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Stripe Account (for payments)

### 2. Setup

```bash
cd backend
npm install
```

### 3. Environment Configuration

Create a `.env` file with:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/travelsphere

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Frontend
FRONTEND_URL=http://localhost:8000
```

### 4. Start Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs on `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Body: {
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+9199999999",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Login
```
POST /api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
Response: { token, user }
```

#### Get Current User
```
GET /api/auth/me
Headers: { Authorization: "Bearer {token}" }
```

### Package Endpoints

#### Get All Packages
```
GET /api/packages?category=student&sortBy=price-low&page=1&limit=10
```

#### Get Single Package
```
GET /api/packages/:id
```

#### Create Package (Admin)
```
POST /api/packages
Headers: { Authorization: "Bearer {token}" }
Body: { package data }
```

#### Update Package (Admin)
```
PUT /api/packages/:id
Headers: { Authorization: "Bearer {token}" }
Body: { updated fields }
```

#### Delete Package (Admin)
```
DELETE /api/packages/:id
Headers: { Authorization: "Bearer {token}" }
```

### Booking Endpoints

#### Create Booking
```
POST /api/bookings
Headers: { Authorization: "Bearer {token}" }
Body: {
  "packageId": "...",
  "numberOfTravelers": 2,
  "travelersDetails": [...],
  "departureDate": "2026-05-15",
  "specialRequests": "...",
  "hotelRoomPreference": "double",
  "mealPreference": "mixed"
}
```

#### Get My Bookings
```
GET /api/bookings/my-bookings
Headers: { Authorization: "Bearer {token}" }
```

#### Get Booking Details
```
GET /api/bookings/:id
Headers: { Authorization: "Bearer {token}" }
```

#### Cancel Booking
```
PUT /api/bookings/:id/cancel
Headers: { Authorization: "Bearer {token}" }
Body: { "reason": "..." }
```

#### Get All Bookings (Admin)
```
GET /api/bookings?status=confirmed&page=1&limit=10
Headers: { Authorization: "Bearer {token}" }
```

### Payment Endpoints

#### Create Payment Intent
```
POST /api/payments/create-intent
Headers: { Authorization: "Bearer {token}" }
Body: { "bookingId": "..." }
Response: { clientSecret, paymentIntentId, amount }
```

#### Confirm Payment
```
POST /api/payments/confirm
Headers: { Authorization: "Bearer {token}" }
Body: { "bookingId": "...", "paymentIntentId": "..." }
```

#### Get Payment History
```
GET /api/payments/history
Headers: { Authorization: "Bearer {token}" }
```

### User Endpoints

#### Get Profile
```
GET /api/users/profile
Headers: { Authorization: "Bearer {token}" }
```

#### Update Profile
```
PUT /api/users/profile
Headers: { Authorization: "Bearer {token}" }
Body: {
  "firstName": "...",
  "lastName": "...",
  "phone": "...",
  "address": {...}
}
```

#### Change Password
```
PUT /api/users/change-password
Headers: { Authorization: "Bearer {token}" }
Body: {
  "oldPassword": "...",
  "newPassword": "...",
  "confirmPassword": "..."
}
```

### Admin Endpoints

#### Dashboard Stats
```
GET /api/admin/stats
Headers: { Authorization: "Bearer {token}" }
```

#### Get All Users
```
GET /api/admin/users?page=1&limit=10
Headers: { Authorization: "Bearer {token}" }
```

#### Update User Role
```
PUT /api/admin/users/:userId/role
Headers: { Authorization: "Bearer {token}" }
Body: { "role": "admin" | "user" }
```

#### Revenue Statistics
```
GET /api/admin/revenue
Headers: { Authorization: "Bearer {token}" }
```

## Database Models

### User
- Authentication fields
- Profile information
- Bookings array
- Address details
- Email verification

### Package
- Name, category, description
- Destination, duration
- Pricing (original & discounted)
- Hotel details & amenities
- Travel highlights
- Itinerary
- Booking limits

### Booking
- Package reference
- Traveler details
- Departure date
- Total price
- Payment status
- Special requests
- Confirmation tracking

### Payment
- Stripe integration
- Transaction details
- Amount & status
- Payment method
- Metadata

### Review
- Rating & comments
- Verified purchase flag
- Helpful votes

## Project Structure

```
backend/
├── models/           # Database schemas
│   ├── User.js
│   ├── Package.js
│   ├── Booking.js
│   ├── Payment.js
│   └── Review.js
├── controllers/      # Business logic
│   ├── authController.js
│   ├── packageController.js
│   ├── bookingController.js
│   ├── paymentController.js
│   ├── userController.js
│   └── adminController.js
├── routes/          # API routes
│   ├── authRoutes.js
│   ├── packageRoutes.js
│   ├── bookingRoutes.js
│   ├── paymentRoutes.js
│   ├── userRoutes.js
│   └── adminRoutes.js
├── middleware/      # Custom middleware
│   └── auth.js
├── utils/           # Helper functions
│   ├── emailService.js
│   ├── paymentService.js
│   └── helpers.js
├── config/          # Configuration
│   └── database.js
├── server.js        # Main entry point
├── package.json
└── .env            # Environment variables
```

## Frontend Integration

Connect your frontend to backend:

```javascript
const API_URL = 'http://localhost:5000/api';

// Example: Register user
fetch(`${API_URL}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+9199999999',
    password: 'password123',
    confirmPassword: 'password123'
  })
})
.then(res => res.json())
.then(data => {
  // Store token
  localStorage.setItem('token', data.token);
});
```

## Error Handling

All errors return standard format:

```json
{
  "success": false,
  "message": "Error description",
  "error": {}
}
```

## Security Features

✅ JWT Authentication
✅ Password Hashing (bcrypt)
✅ Role-Based Access Control
✅ CORS Enabled
✅ Input Validation
✅ Secure Payment Processing

## Deployment

### Heroku

```bash
git push heroku main
```

### AWS/DigitalOcean

1. Install dependencies
2. Set environment variables
3. Start with `npm start`
4. Point domain to your server

## Support

For issues or questions, contact: support@travelsphere.com

---

**Version:** 1.0.0
**Last Updated:** April 3, 2026
