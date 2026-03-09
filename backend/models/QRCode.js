const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['url', 'text', 'email', 'phone', 'wifi', 'contact'],
        },
        originalData: {
            type: Object, // Store raw data based on type
            required: true,
        },
        shortId: {
            type: String,
            required: true,
            unique: true,
        },
        scanCount: {
            type: Number,
            default: 0,
        },
        expiryDate: {
            type: Date,
        },
        passwordHash: {
            type: String,
        },
        oneTime: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
    }
);

const QRCode = mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCode;
