import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, QrCode, PlusCircle, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center text-brand-600 font-bold text-xl gap-2">
                            <QrCode size={28} />
                            <span>Qrify</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link to="/" className="text-gray-600 hover:text-brand-600 flex items-center gap-1.5 font-medium transition-colors">
                                    <LayoutDashboard size={18} />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Link>
                                <Link to="/generate" className="text-gray-600 hover:text-brand-600 flex items-center gap-1.5 font-medium transition-colors ml-4">
                                    <PlusCircle size={18} />
                                    <span className="hidden sm:inline">Create QR</span>
                                </Link>
                                <div className="h-6 w-px bg-gray-200 mx-4"></div>
                                <span className="text-sm text-gray-600 font-medium">Hi, {user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-500 hover:bg-gray-100 hover:text-red-500 flex items-center transition-colors p-2 rounded-lg ml-2"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-brand-600 font-medium">Login</Link>
                                <Link to="/signup" className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 font-medium transition-colors shadow-sm">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
