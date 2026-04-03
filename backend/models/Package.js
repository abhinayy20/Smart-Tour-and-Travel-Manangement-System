const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide package name'],
        trim: true
    },
    category: {
        type: String,
        enum: ['featured', 'student', 'couple', 'international'],
        required: [true, 'Please provide category']
    },
    description: {
        type: String,
        required: [true, 'Please provide description']
    },
    destination: [{
        type: String,
        required: true
    }],
    duration: {
        days: {
            type: Number,
            required: true
        },
        nights: {
            type: Number,
            required: true
        }
    },
    price: {
        original: {
            type: Number,
            required: [true, 'Please provide original price']
        },
        discountedPrice: {
            type: Number,
            required: [true, 'Please provide discounted price']
        },
        discount: {
            type: Number,
            default: 0
        }
    },
    hotel: {
        name: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min: 0,
            max: 5
        },
        amenities: [String]
    },
    travelHighlights: [String],
    image: String,
    maxParticipants: Number,
    currentBookings: {
        type: Number,
        default: 0
    },
    includesFlights: {
        type: Boolean,
        default: false
    },
    includesMeals: {
        type: Boolean,
        default: false
    },
    includesGuide: {
        type: Boolean,
        default: false
    },
    includesTransport: {
        type: Boolean,
        default: false
    },
    departureMonths: [String],
    bestTimeToVisit: String,
    difficulty: {
        type: String,
        enum: ['easy', 'moderate', 'difficult'],
        default: 'moderate'
    },
    itinerary: [{
        day: Number,
        title: String,
        description: String,
        activities: [String]
    }],
    isActive: {
        type: Boolean,
        default: true
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

module.exports = mongoose.model('Package', packageSchema);
