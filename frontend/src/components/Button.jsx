import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = 'px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
        secondary: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-transparent focus:ring-2 focus:ring-gray-200'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
