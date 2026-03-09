import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import QRTypeSelector from '../components/QRTypeSelector';
import { QrCode, Link as LinkIcon, Type, Mail, Phone, Wifi, Contact, Shield, Calendar, Clock } from 'lucide-react';

const QR_TYPES = [
    { id: 'url', label: 'URL', icon: LinkIcon, placeholder: 'https://example.com' },
    { id: 'text', label: 'Rich Text', icon: Type, placeholder: 'Hello world...' },
    { id: 'email', label: 'Email', icon: Mail, placeholder: 'you@example.com' },
    { id: 'phone', label: 'Phone', icon: Phone, placeholder: '+1234567890' },
    { id: 'wifi', label: 'WiFi', icon: Wifi, placeholder: 'Network Name' },
    { id: 'contact', label: 'vCard', icon: Contact, placeholder: 'John Doe' },
];

const GenerateQR = () => {
    const [type, setType] = useState('url');
    const [formData, setFormData] = useState({ url: '' });
    const [advanced, setAdvanced] = useState({ password: '', expiryDate: '', oneTime: false });
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleTypeChange = (newType) => {
        setType(newType);
        setFormData({}); // Reset form data
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAdvancedChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAdvanced(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = { type, originalData: formData, ...advanced };
            if (!payload.password) delete payload.password;
            if (!payload.expiryDate) delete payload.expiryDate;

            await api.post('/qrcodes', payload);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate QR');
        } finally {
            setLoading(false);
        }
    };

    const renderFormFields = () => {
        const fields = {
            url: () => (<div><label className="text-sm">URL</label><input name="url" type="url" required value={formData.url || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500" placeholder="https://example.com" /></div>),
            text: () => (<div><label className="text-sm">Text</label><textarea name="text" required rows="3" value={formData.text || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" placeholder="Write something..." /></div>),
            email: () => (<div className="space-y-3"><div><label className="text-sm">Email To</label><input name="email" type="email" required value={formData.email || ''} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" placeholder="you@domain.com" /></div><div><label className="text-sm">Subject</label><input name="subject" value={formData.subject || ''} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" /></div><div><label className="text-sm">Body</label><textarea name="body" rows="2" value={formData.body || ''} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" /></div></div>),
            phone: () => (<div><label className="text-sm">Phone Number</label><input name="phone" type="tel" required value={formData.phone || ''} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" placeholder="+1234567890" /></div>),
            wifi: () => (<div className="space-y-3"><div><label className="text-sm">SSID</label><input name="ssid" required value={formData.ssid || ''} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" /></div><div><label className="text-sm">Password</label><input name="password" value={formData.password || ''} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" /></div><div><label className="text-sm">Encryption</label><select name="encryption" value={formData.encryption || 'WPA'} onChange={handleInputChange} className="w-full px-3 py-2 border rounded bg-white"><option value="WPA">WPA/WPA2/WPA3</option><option value="WEP">WEP</option><option value="nopass">None</option></select></div></div>),
            contact: () => (<div className="grid grid-cols-2 gap-3"><div><label className="text-sm">First Name</label><input name="firstName" required value={formData.firstName || ''} onChange={handleInputChange} className="w-full px-3 border rounded py-1" /></div><div><label className="text-sm">Last Name</label><input name="lastName" required value={formData.lastName || ''} onChange={handleInputChange} className="w-full px-3 border rounded py-1" /></div><div><label className="text-sm">Phone</label><input name="phone" type="tel" value={formData.phone || ''} onChange={handleInputChange} className="w-full px-3 border rounded py-1" /></div><div><label className="text-sm">Email</label><input name="email" type="email" value={formData.email || ''} onChange={handleInputChange} className="w-full px-3 border rounded py-1" /></div><div className="col-span-2"><label className="text-sm">Company</label><input name="organization" value={formData.organization || ''} onChange={handleInputChange} className="w-full px-3 border rounded py-1" /></div></div>)
        };
        return fields[type] ? fields[type]() : null;
    };

    return (
        <div className="w-full">
            <PageHeader
                title="Create New QR Code"
                subtitle="Select a type and enter your details to generate a dynamic QR code"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-4 h-full">
                    <Card className="h-full">
                        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 pb-4 border-b border-gray-100">
                            QR Code Type
                        </h2>
                        <QRTypeSelector
                            types={QR_TYPES}
                            activeType={type}
                            onChange={handleTypeChange}
                        />
                    </Card>
                </div>

                <div className="lg:col-span-8">
                    <Card>
                        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 text-sm font-medium">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <QrCode size={20} className="text-brand-500" />
                                        Basic Details
                                    </h2>
                                    {renderFormFields()}
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowAdvanced(!showAdvanced)}
                                        className="text-brand-600 font-medium text-sm flex items-center gap-2 hover:text-brand-700 focus:outline-none transition-colors"
                                    >
                                        {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                                    </button>

                                    {showAdvanced && (
                                        <div className="mt-5 p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-5">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5"><Shield size={16} className="text-gray-500" /> Password Protection</label>
                                                <input name="password" type="password" value={advanced.password} onChange={handleAdvancedChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none mt-1 shadow-sm" placeholder="Leave blank for no password" />
                                                <p className="text-xs text-gray-500 mt-1.5">Users will need to enter this password before scanning redirects.</p>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5"><Calendar size={16} className="text-gray-500" /> Expiry Date</label>
                                                <input name="expiryDate" type="datetime-local" value={advanced.expiryDate} onChange={handleAdvancedChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none mt-1 bg-white shadow-sm" />
                                                <p className="text-xs text-gray-500 mt-1.5">QR code will become inactive after this date.</p>
                                            </div>

                                            <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm transition-colors hover:border-brand-200">
                                                <input id="oneTime" name="oneTime" type="checkbox" checked={advanced.oneTime} onChange={handleAdvancedChange} className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded cursor-pointer" />
                                                <label htmlFor="oneTime" className="text-sm font-medium text-gray-700 flex items-center gap-1.5 cursor-pointer select-none leading-none"><Clock size={16} className="text-gray-500" /> One-Time Use</label>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end pt-6 border-t border-gray-100">
                                    <Button type="submit" variant="primary" disabled={loading}>
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <>
                                                <QrCode size={18} />
                                                Generate QR Code
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default GenerateQR;
