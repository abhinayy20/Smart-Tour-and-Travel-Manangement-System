const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { createPaymentIntent, processPayment } = require('../utils/paymentService');

// Create payment intent
exports.createPaymentIntent = async (req, res) => {
    try {
        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        const paymentIntent = await createPaymentIntent(booking.totalPrice, booking.bookingReference);

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: booking.totalPrice
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Confirm payment
exports.confirmPayment = async (req, res) => {
    try {
        const { bookingId, paymentIntentId } = req.body;

        const result = await processPayment(bookingId, paymentIntentId);

        if (result.success) {
            res.json({
                success: true,
                message: 'Payment confirmed successfully',
                booking: result.booking
            });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.user._id })
            .populate('bookingId')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
