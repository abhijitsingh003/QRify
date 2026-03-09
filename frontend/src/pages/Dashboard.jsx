import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import QRCard from '../components/QRCard';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { PlusCircle, QrCode } from 'lucide-react';

const Dashboard = () => {
    const [qrCodes, setQrCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchQRCodes = async () => {
        try {
            setQrCodes((await api.get('/qrcodes')).data);
        } catch {
            setError('Failed to load QR codes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchQRCodes() }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this QR code?')) {
            try {
                await api.delete(`/qrcodes/${id}`);
                setQrCodes(qrCodes.filter(qr => qr._id !== id));
            } catch {
                alert('Failed to delete QR code');
            }
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div></div>;

    return (
        <div className="w-full">
            <PageHeader
                title="Your QR Codes"
                subtitle="Manage and track your dynamic QR codes"
                action={
                    <Link
                        to="/generate"
                        className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
                    >
                        <PlusCircle size={20} />
                        <span>Create New QR</span>
                    </Link>
                }
            />

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

            {qrCodes.length === 0 ? (
                <Card className="text-center py-16">
                    <div className="inline-flex items-center justify-center bg-brand-50 p-4 rounded-full text-brand-600 mb-5">
                        <QrCode size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No QR codes yet</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Create your first dynamic QR code to start tracking scans and engaging your audience.</p>
                    <Link
                        to="/generate"
                        className="inline-flex items-center justify-center bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        Create Your First QR
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {qrCodes.map(qr => (
                        <QRCard key={qr._id} qr={qr} onDelete={() => handleDelete(qr._id)} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
