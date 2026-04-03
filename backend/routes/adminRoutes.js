const express = require('express');
const {
    getDashboardStats,
    getAllUsers,
    updateUserRole,
    getRevenueStats
} = require('../controllers/adminController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', auth, adminOnly, getDashboardStats);
router.get('/users', auth, adminOnly, getAllUsers);
router.put('/users/:userId/role', auth, adminOnly, updateUserRole);
router.get('/revenue', auth, adminOnly, getRevenueStats);

module.exports = router;
