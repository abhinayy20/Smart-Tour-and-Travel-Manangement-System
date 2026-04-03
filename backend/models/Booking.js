const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user ID']
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
        required: [true, 'Please provide package ID']
    },
    bookingReference: {
        type: String,
        unique: true,
        required: true
    },
    numberOfTravelers: {
        type: Number,
        required: [true, 'Please provide number of travelers'],
        min: 1
    },
    totalPrice: {
        type: Number,
        required: [true, 'Please provide total price']
    },
    travelersDetails: [{
        name: {
            type: String,
            required: true
        },
        email: String,
        phone: String,
        age: Number,
        passportNumber: String,
        dateOfBirth: Date
    }],
    departureDate: {
        type: Date,
        required: [true, 'Please provide departure date']
    },
    specialRequests: String,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentId: String,
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'net_banking', 'upi'],
        default: 'credit_card'
    },
    paymentDate: Date,
    cancellationReason: String,
    cancellationDate: Date,
    refundAmount: Number,
    notes: String,
    hotelRoomPreference: {
        type: String,
        enum: ['single', 'double', 'suite', 'dormitory'],
        default: 'double'
    },
    mealPreference: {
        type: String,
        enum: ['vegetarian', 'non-vegetarian', 'vegan', 'mixed'],
        default: 'mixed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    confirmationEmailSent: {
        type: Boolean,
        default: false
    },
    confirmationEmailSentAt: Date
});

// Generate booking reference
bookingSchema.pre('save', async function(next) {
    if (!this.bookingReference) {
        this.bookingReference = 'TS' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
