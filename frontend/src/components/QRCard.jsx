import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Copy, Trash2, Download, Eye, Link as LinkIcon, Lock, Clock, Calendar, CheckCircle } from 'lucide-react';

const QRCard = ({ qr, onDelete }) => {
    const [imageUrl, setImageUrl] = useState('');
    const [copied, setCopied] = useState(false);

    const redirectUrl = `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/r/${qr.shortId}`;

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const { data } = await api.get(`/qrcodes/${qr.shortId}/image`);
                setImageUrl(data.qrImage);
            } catch (err) {
                console.error('Error fetching image');
            }
        };
        fetchImage();
    }, [qr.shortId]);

    const handleCopy = () => {
        navigator.clipboard.writeText(redirectUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!imageUrl) return;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `qr-${qr.shortId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isExpired = qr.expiryDate && new Date() > new Date(qr.expiryDate);
    const isDead = !qr.isActive || isExpired;

    return (
        <div className={`bg-white rounded-xl border hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col ${isDead ? 'border-red-200' : 'border-gray-200'}`}>
            <div className="p-5 flex-grow flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-gray-100 text-gray-700 uppercase tracking-wider">
                        {qr.type}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        {qr.passwordHash && <Lock size={14} title="Password Protected" />}
                        {qr.oneTime && <Clock size={14} className="text-orange-400" title="One-time Use" />}
                        {qr.expiryDate && <Calendar size={14} className={isExpired ? "text-red-500" : "text-brand-400"} title="Has Expiry Date" />}
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center p-1.5 border border-gray-100 flex-shrink-0">
                        {imageUrl ? (
                            <img src={imageUrl} alt="QR Code" className="w-full h-full object-contain" />
                        ) : (
                            <div className="animate-pulse w-full h-full bg-gray-200 rounded text-transparent">Loading</div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate text-base" title={qr.originalData.url || qr.originalData.text || qr.originalData.email || 'QR Data'}>
                            {qr.originalData.url || qr.originalData.text || qr.originalData.email || qr.originalData.phone || qr.originalData.ssid || 'Contact Card'}
                        </h4>

                        <div className="flex items-center text-sm text-brand-600 mt-1 truncate">
                            <LinkIcon size={14} className="mr-1.5 flex-shrink-0" />
                            <a href={redirectUrl} target="_blank" rel="noreferrer" className="truncate hover:underline font-medium">
                                qrify.in/{qr.shortId}
                            </a>
                        </div>

                        <div className="flex items-center mt-2 text-sm text-gray-500">
                            <Eye size={14} className="mr-1.5" />
                            <span className="font-medium text-gray-700 mr-1">{qr.scanCount}</span>
                            <span>scans</span>
                        </div>
                    </div>
                </div>

                {isDead && (
                    <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100 mt-auto">
                        {isExpired ? 'Expired QR Code' : 'Inactive (Used one-time)'}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-3 border-t border-gray-100 bg-gray-50/50 divide-x divide-gray-100">
                <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-gray-50 transition-colors focus:outline-none"
                    title="Copy Link"
                >
                    {copied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                    onClick={handleDownload}
                    disabled={!imageUrl}
                    className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-gray-50 transition-colors disabled:opacity-50 focus:outline-none"
                    title="Download PNG"
                >
                    <Download size={16} />
                    Save
                </button>
                <button
                    onClick={onDelete}
                    className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors focus:outline-none"
                    title="Delete"
                >
                    <Trash2 size={16} />
                    Delete
                </button>
            </div>
        </div>
    );
};

export default QRCard;
