const mongoose = require('mongoose');
const Package = require('../models/Package');
const dotenv = require('dotenv');

dotenv.config();

const seedPackages = [
    {
        name: 'Goa Beach Edition',
        category: 'student',
        description: 'Budget-friendly beach adventure perfect for students',
        destination: ['Goa'],
        duration: { days: 5, nights: 4 },
        price: {
            original: 21500,
            discountedPrice: 15999,
            discount: 25
        },
        hotel: {
            name: '3-Star Beachfront Resort',
            rating: 3.5,
            amenities: ['Free WiFi', 'Pool', 'Beach Access', 'Buffet Meals', 'AC Rooms']
        },
        travelHighlights: ['Parasailing', 'Water Sports', 'Beach Bonfire', 'Nightlife Tours', 'Airport Transfers'],
        maxParticipants: 50,
        includesFlights: true,
        includesMeals: true,
        includesGuide: true,
        includesTransport: true,
        departureMonths: ['January', 'February', 'March', 'November', 'December'],
        bestTimeToVisit: 'November to March',
        difficulty: 'easy',
        isActive: true
    },
    {
        name: 'Himachal Adventure',
        category: 'student',
        description: 'Trekking and camping in the majestic himalayas',
        destination: ['Manali', 'Kasol', 'Shimla'],
        duration: { days: 6, nights: 5 },
        price: {
            original: 18600,
            discountedPrice: 12999,
            discount: 30
        },
        hotel: {
            name: 'Hill Station Budget Resort',
            rating: 3.8,
            amenities: ['WiFi in Common Areas', 'Mountain View', 'Breakfast & Dinner', 'Social Lounge']
        },
        travelHighlights: ['Bus Trek', 'Camping', 'Mountain Trekking', 'Photography', 'Local Cuisine'],
        maxParticipants: 40,
        includesFlights: false,
        includesMeals: true,
        includesGuide: true,
        includesTransport: true,
        departureMonths: ['April', 'May', 'September', 'October'],
        bestTimeToVisit: 'April to May & September to October',
        difficulty: 'moderate',
        isActive: true
    },
    {
        name: 'Rajasthan Heritage Tour',
        category: 'student',
        description: 'Experience the royal heritage and vibrant culture of Rajasthan',
        destination: ['Jaipur', 'Udaipur', 'Jodhpur'],
        duration: { days: 7, nights: 6 },
        price: {
            original: 29200,
            discountedPrice: 18999,
            discount: 35
        },
        hotel: {
            name: 'Heritage 3-Star Hotel',
            rating: 4,
            amenities: ['Free WiFi', 'AC Rooms', 'Rajasthani Meals', 'Gaming Lounge']
        },
        travelHighlights: ['Palace Tours', 'Desert Safari', 'Art Workshops', 'City Tours', 'Local Transport'],
        maxParticipants: 35,
        includesFlights: false,
        includesMeals: true,
        includesGuide: true,
        includesTransport: true,
        departureMonths: ['October', 'November', 'February', 'March'],
        bestTimeToVisit: 'October to March',
        difficulty: 'easy',
        isActive: true
    },
    {
        name: 'Maldives Paradise',
        category: 'couple',
        description: 'Romantic overwater bungalows and pristine beaches',
        destination: ['Male', 'Malé Atoll'],
        duration: { days: 5, nights: 4 },
        price: {
            original: 187500,
            discountedPrice: 149999,
            discount: 20
        },
        hotel: {
            name: '5-Star Overwater Bungalow',
            rating: 5,
            amenities: ['Luxury WiFi', 'Private Plunge Pool', 'Romantic Dinners', 'Spa', 'Smart TV']
        },
        travelHighlights: ['International Flights', 'Snorkeling', 'Sunset Cruise', 'Couples Spa', 'Candlelight Dinner'],
        maxParticipants: 30,
        includesFlights: true,
        includesMeals: true,
        includesGuide: true,
        includesTransport: true,
        departureMonths: ['January', 'February', 'March', 'July', 'August'],
        bestTimeToVisit: 'November to March',
        difficulty: 'easy',
        isActive: true
    },
    {
        name: 'Kerala Backwaters Bliss',
        category: 'couple',
        description: 'Serene houseboat cruises through backwaters',
        destination: ['Kochi', 'Alleppey', 'Munnar'],
        duration: { days: 4, nights: 3 },
        price: {
            original: 88000,
            discountedPrice: 65999,
            discount: 25
        },
        hotel: {
            name: '4-Star Luxury Houseboat',
            rating: 4.5,
            amenities: ['WiFi', 'AC Bedroom', 'Home-Cooked Meals', 'Spa', 'Modern Bathroom']
        },
        travelHighlights: ['Houseboat Cruise', 'Spice Plantations', 'Fishing', 'Beach Walk', 'Ayurveda Massage'],
        maxParticipants: 20,
        includesFlights: false,
        includesMeals: true,
        includesGuide: true,
        includesTransport: true,
        departureMonths: ['September', 'October', 'November', 'December', 'January'],
        bestTimeToVisit: 'September to March',
        difficulty: 'easy',
        isActive: true
    },
    {
        name: 'European Grand Tour',
        category: 'international',
        description: 'Experience the beauty of Europe through iconic cities',
        destination: ['Paris', 'Rome', 'Barcelona', 'Vienna'],
        duration: { days: 14, nights: 13 },
        price: {
            original: 440000,
            discountedPrice: 299999,
            discount: 32
        },
        hotel: {
            name: '5-Star Europe Luxury Hotels',
            rating: 5,
            amenities: ['Premium WiFi', 'Smart Rooms', 'Concierge', 'World-Class Dining', 'Spa']
        },
        travelHighlights: ['Flights & Transfers', 'Eiffel Tower', 'Vatican', 'Architecture', 'Train Journeys'],
        maxParticipants: 50,
        includesFlights: true,
        includesMeals: true,
        includesGuide: true,
        includesTransport: true,
        departureMonths: ['April', 'May', 'June', 'September', 'October'],
        bestTimeToVisit: 'April to June & September to October',
        difficulty: 'moderate',
        isActive: true
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travelsphere');
        console.log('Connected to MongoDB');

        // Clear existing packages
        await Package.deleteMany({});
        console.log('Cleared existing packages');

        // Insert seed data
        const insertedPackages = await Package.insertMany(seedPackages);
        console.log(`✅ Inserted ${insertedPackages.length} packages successfully`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run if called directly
if (require.main === module) {
    seedDatabase();
}

module.exports = seedDatabase;
