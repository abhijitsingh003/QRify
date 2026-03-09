const QRCodeDb = require('../models/QRCode');
const generateId = require('../utils/generateId');
const QRCode = require('qrcode');
const bcrypt = require('bcrypt');

const createQRCode = async (req, res) => {
    try {
        const { type, originalData, expiryDate, password, oneTime } = req.body;
        const shortId = generateId();

        const qrData = {
            userId: req.user._id,
            type,
            originalData,
            shortId,
            oneTime: !!oneTime,
            ...(expiryDate && { expiryDate: new Date(expiryDate) }),
            ...(password && { passwordHash: await bcrypt.hash(password, await bcrypt.genSalt(10)) })
        };

        const newQr = await QRCodeDb.create(qrData);
        const redirectUrl = `${process.env.BASE_URL}/r/${shortId}`;
        const qrImage = await QRCode.toDataURL(redirectUrl);

        res.status(201).json({ qrCode: newQr, qrImage, redirectUrl });
    } catch (err) {
        res.status(500).json({ message: 'Error creating QR code' });
    }
};

const getQRCodes = async (req, res) => {
    try {
        res.json(await QRCodeDb.find({ userId: req.user._id }).sort('-createdAt'));
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

const generateQRImage = async (req, res) => {
    try {
        const qr = await QRCodeDb.findOne({ shortId: req.params.id, userId: req.user._id });
        if (!qr) return res.status(404).json({ message: 'Not found' });

        const url = `${process.env.BASE_URL}/r/${qr.shortId}`;
        res.json({ qrImage: await QRCode.toDataURL(url), redirectUrl: url });
    } catch (error) {
        res.status(500).json({ message: 'Server error parsing image' });
    }
};

const deleteQRCode = async (req, res) => {
    try {
        const doc = await QRCodeDb.findOne({ _id: req.params.id, userId: req.user._id });
        if (!doc) {
            return res.status(404).json({ message: 'QR not found' });
        }
        await QRCodeDb.deleteOne({ _id: doc._id });
        res.json({ message: 'OK' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting' });
    }
};

module.exports = {
    createQRCode,
    getQRCodes,
    deleteQRCode,
    generateQRImage
};
