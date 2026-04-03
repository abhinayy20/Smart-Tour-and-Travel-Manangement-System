const express = require('express');
const {
    createBooking,
    getUserBookings,
    getBookingById,
    cancelBooking,
    getAllBookings
} = require('../controllers/bookingController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// User routes
router.post('/', auth, createBooking);
router.get('/my-bookings', auth, getUserBookings);
router.get('/:id', auth, getBookingById);
router.put('/:id/cancel', auth, cancelBooking);

// Admin routes
router.get('/', auth, adminOnly, getAllBookings);

module.exports = router;
