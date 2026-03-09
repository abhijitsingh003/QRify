const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const QRCodeDb = require('../models/QRCode');

const wrapHTML = (content) => `<div style="font-family: sans-serif; max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">${content}</div>`;

router.get('/:shortId', async (req, res) => {
    try {
        const qr = await QRCodeDb.findOne({ shortId: req.params.shortId });
        if (!qr) return res.status(404).send('QR code not found');
        if (!qr.isActive) return res.status(400).send('QR code is no longer active (one-time used)');
        if (qr.expiryDate && new Date() > new Date(qr.expiryDate)) return res.status(400).send('QR expired');

        if (qr.passwordHash) {
            if (!req.query.pwd) {
                return res.send(wrapHTML(`
                    <h3>Password Protected QR Code</h3>
                    <form method="GET">
                        <input type="password" name="pwd" placeholder="Enter password" required style="width: 100%; padding: 10px; margin-bottom: 10px;" />
                        <button type="submit" style="width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px;">Unlock</button>
                    </form>
                `));
            }
            if (!(await bcrypt.compare(req.query.pwd, qr.passwordHash))) {
                return res.status(401).send('Incorrect password. <a href="javascript:history.back()">Go back</a> and try again.');
            }
        }

        qr.scanCount += 1;
        if (qr.oneTime) qr.isActive = false;
        await qr.save();

        const data = qr.originalData;
        switch (qr.type) {
            case 'url': return res.redirect(data.url.startsWith('http') ? data.url : 'https://' + data.url);
            case 'email': return res.redirect(`mailto:${data.email}?subject=${data.subject || ''}&body=${data.body || ''}`);
            case 'phone': return res.redirect(`tel:${data.phone}`);
            case 'text': return res.send(wrapHTML(`<h3>Text Content:</h3><p>${data.text}</p>`));
            case 'wifi': return res.send(wrapHTML(`<h3>WiFi Credentials</h3><p><strong>SSID:</strong> ${data.ssid}</p><p><strong>Password:</strong> ${data.password}</p><p><strong>Encryption:</strong> ${data.encryption}</p>`));
            case 'contact':
                const vcf = `BEGIN:VCARD\nVERSION:3.0\nN:${data.lastName || ''};${data.firstName || ''}\nFN:${data.firstName || ''} ${data.lastName || ''}\nORG:${data.organization || ''}\nTEL:${data.phone || ''}\nEMAIL:${data.email || ''}\nEND:VCARD`;
                res.setHeader('Content-Type', 'text/vcard');
                res.setHeader('Content-Disposition', 'attachment; filename="contact.vcf"');
                return res.send(vcf);
            default: return res.send('Unknown QR type!');
        }
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
