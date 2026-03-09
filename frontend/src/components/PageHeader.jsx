import React from 'react';

const PageHeader = ({ title, subtitle, action }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
                {subtitle && <p className="text-gray-500 mt-1 text-sm sm:text-base">{subtitle}</p>}
            </div>
            {action && (
                <div className="flex-shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
};

export default PageHeader;
