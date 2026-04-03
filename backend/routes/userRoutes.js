const express = require('express');
const {
    updateProfile,
    changePassword,
    getProfile
} = require('../controllers/userController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);

module.exports = router;
