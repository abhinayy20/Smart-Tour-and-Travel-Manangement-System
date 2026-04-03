const Booking = require('../models/Booking');
const Package = require('../models/Package');
const User = require('../models/User');
const { sendEmail, bookingConfirmationEmail } = require('../utils/emailService');
const { createPaymentIntent } = require('../utils/paymentService');

// Create booking
exports.createBooking = async (req, res) => {
    try {
        const {
            packageId,
            numberOfTravelers,
            travelersDetails,
            departureDate,
            specialRequests,
            hotelRoomPreference,
            mealPreference
        } = req.body;

        // Get package details
        const pkg = await Package.findById(packageId);
        if (!pkg) {
            return res.status(404).json({ success: false, message: 'Package not found' });
        }

        // Calculate total price
        const totalPrice = pkg.price.discountedPrice * numberOfTravelers;

        // Create booking
        const booking = new Booking({
            userId: req.user._id,
            packageId,
            numberOfTravelers,
            travelersDetails,
            departureDate,
            specialRequests,
            hotelRoomPreference,
            mealPreference,
            totalPrice
        });

        await booking.save();

        // Add booking to user's bookings
        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { bookings: booking._id } }
        );

        // Send confirmation email
        const emailContent = bookingConfirmationEmail(booking, req.user, pkg);
        await sendEmail(req.user.email, 'Booking Confirmation', emailContent);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('packageId')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('packageId')
            .populate('userId');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Check authorization
        if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ success: false, message: 'Booking already cancelled' });
        }

        booking.status = 'cancelled';
        booking.cancellationDate = new Date();
        booking.cancellationReason = req.body.reason || 'User requested cancellation';

        if (booking.paymentStatus === 'paid') {
            booking.paymentStatus = 'refunded';
            booking.refundAmount = booking.totalPrice;
        }

        await booking.save();

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        let query = {};
        if (status) query.status = status;

        const bookings = await Booking.find(query)
            .populate('userId')
            .populate('packageId')
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Booking.countDocuments(query);

        res.json({
            success: true,
            data: bookings,
            pagination: {
                currentPage: parseInt(page),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
