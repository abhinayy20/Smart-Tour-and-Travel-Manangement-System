const express = require('express');
const {
    getAllPackages,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage
} = require('../controllers/packageController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllPackages);
router.get('/:id', getPackageById);

// Admin routes
router.post('/', auth, adminOnly, createPackage);
router.put('/:id', auth, adminOnly, updatePackage);
router.delete('/:id', auth, adminOnly, deletePackage);

module.exports = router;
