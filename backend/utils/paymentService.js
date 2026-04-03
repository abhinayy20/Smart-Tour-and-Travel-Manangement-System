const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { sendEmail, paymentConfirmationEmail } = require('./emailService');
const Package = require('../models/Package');

const createPaymentIntent = async (amount, bookingReference) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to paise
            currency: 'inr',
            metadata: {
                bookingReference: bookingReference
            }
        });

        return paymentIntent;
    } catch (error) {
        throw error;
    }
};

const processPayment = async (bookingId, paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            const booking = await Booking.findByIdAndUpdate(
                bookingId,
                {
                    paymentStatus: 'paid',
                    paymentId: paymentIntentId,
                    paymentDate: new Date(),
                    status: 'confirmed'
                },
                { new: true }
            ).populate('packageId').populate('userId');

            // Save payment record
            const payment = new Payment({
                bookingId: bookingId,
                userId: booking.userId._id,
                amount: paymentIntent.amount / 100,
                stripePaymentId: paymentIntentId,
                status: 'completed',
                paymentMethod: 'credit_card',
                transactionId: paymentIntentId,
                metadata: {
                    bookingReference: booking.bookingReference,
                    packageName: booking.packageId.name
                }
            });

            await payment.save();

            // Send confirmation email
            const emailContent = paymentConfirmationEmail(
                booking.userId,
                booking,
                booking.packageId
            );
            await sendEmail(booking.userId.email, 'Payment Confirmation', emailContent);

            return { success: true, booking };
        } else {
            return { success: false, message: 'Payment not completed' };
        }
    } catch (error) {
        throw error;
    }
};

module.exports = { createPaymentIntent, processPayment };
