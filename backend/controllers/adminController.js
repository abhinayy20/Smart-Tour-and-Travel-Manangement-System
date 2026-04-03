const Booking = require('../models/Booking');
const Package = require('../models/Package');
const User = require('../models/User');
const Payment = require('../models/Payment');

// Dashboard stats
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalPackages = await Package.countDocuments();
        const totalRevenue = await Payment.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const recentBookings = await Booking.find()
            .populate('userId', 'firstName lastName email')
            .populate('packageId', 'name')
            .limit(5)
            .sort({ createdAt: -1 });

        const bookingStats = await Booking.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalBookings,
                totalPackages,
                totalRevenue: totalRevenue[0]?.total || 0,
                bookingStats,
                recentBookings
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const users = await User.find()
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await User.countDocuments();

        res.json({
            success: true,
            data: users,
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

// Update user role
exports.updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        );

        res.json({
            success: true,
            message: 'User role updated',
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get revenue statistics
exports.getRevenueStats = async (req, res) => {
    try {
        const revenueByMonth = await Payment.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const revenueByPackage = await Payment.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: '$metadata.packageName',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } }
        ]);

        res.json({
            success: true,
            data: {
                byMonth: revenueByMonth,
                byPackage: revenueByPackage
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
