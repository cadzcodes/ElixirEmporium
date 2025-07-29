// components/FancyCheckbox.js
import React from 'react';

const FancyCheckbox = ({ checked, onChange, className = '', ...props }) => {
    return (
        <div
            onClick={e => {
                e.stopPropagation();
                onChange?.(e);
            }}
            className={`relative w-6 h-6 cursor-pointer rounded-md border transition-all duration-200 
                ${checked ? 'bg-yellow border-yellow' : 'bg-transparent border-yellow/40 hover:border-yellow/60'}
                ${className}`}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="hidden"
                {...props}
            />
            <svg
                className={`absolute inset-0 w-full h-full p-1 text-black transition-transform duration-200 
                    ${checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        </div>
    );
};

export default FancyCheckbox;
