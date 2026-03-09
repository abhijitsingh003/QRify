import React from 'react';

const QRTypeSelector = ({ types, activeType, onChange }) => {
    return (
        <div className="flex flex-col gap-1.5 h-full">
            {types.map(t => {
                const Icon = t.icon;
                const isActive = activeType === t.id;
                return (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => onChange(t.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all border ${isActive
                                ? 'bg-brand-50 text-brand-700 font-semibold border-brand-200 shadow-sm'
                                : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900 border-transparent'
                            }`}
                    >
                        <Icon size={20} className={isActive ? 'text-brand-600' : 'text-gray-400'} />
                        <span className="font-medium">{t.label}</span>
                    </button>
                )
            })}
        </div>
    );
};

export default QRTypeSelector;
