import React from 'react';

const Card = ({ children, className = '', noPadding = false }) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${noPadding ? '' : 'p-6 sm:p-8'} ${className}`}>
            {children}
        </div>
    );
};

export default Card;
