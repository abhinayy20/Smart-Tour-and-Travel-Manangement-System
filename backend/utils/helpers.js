const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateBookingReference = () => {
    return 'TS' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

module.exports = { generateToken, generateOTP, generateBookingReference };
