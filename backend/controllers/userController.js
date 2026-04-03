const User = require('../models/User');

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, address } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                firstName: firstName || req.user.firstName,
                lastName: lastName || req.user.lastName,
                phone: phone || req.user.phone,
                address: address || req.user.address
            },
            { new: true }
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        const user = await User.findById(req.user._id).select('+password');
        const isPasswordCorrect = await user.comparePassword(oldPassword);

        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: 'Old password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('bookings');

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
