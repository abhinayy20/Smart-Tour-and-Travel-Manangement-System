const express = require('express');
const {
    createPaymentIntent,
    confirmPayment,
    getPaymentHistory
} = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/create-intent', auth, createPaymentIntent);
router.post('/confirm', auth, confirmPayment);
router.get('/history', auth, getPaymentHistory);

module.exports = router;
