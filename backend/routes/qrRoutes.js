const express = require('express');
const { createQRCode, getQRCodes, deleteQRCode, generateQRImage } = require('../controllers/qrController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

router.route('/')
    .post(createQRCode)
    .get(getQRCodes);

router.route('/:id')
    .delete(deleteQRCode);

router.get('/:id/image', generateQRImage);

module.exports = router;
