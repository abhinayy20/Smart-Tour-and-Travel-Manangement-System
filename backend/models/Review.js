const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
        required: true
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Please provide rating'],
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: [true, 'Please provide review title'],
        trim: true
    },
    comment: {
        type: String,
        required: [true, 'Please provide review comment']
    },
    highlights: [String],
    improvements: [String],
    wouldRecommend: {
        type: Boolean,
        default: true
    },
    isVerifiedPurchase: {
        type: Boolean,
        default: true
    },
    helpful: {
        type: Number,
        default: 0
    },
    unhelpful: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Review', reviewSchema);
