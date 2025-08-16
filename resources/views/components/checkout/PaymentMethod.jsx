import React from 'react'
import { FaCreditCard } from 'react-icons/fa';

import { CheckCircle2, HandCoins, DollarSign, Wallet, Smartphone } from 'lucide-react';
const methodIcons = {
    'paymaya': <HandCoins className="text-yellow w-7 h-7" />,
    'PayPal': <Wallet className="text-yellow w-7 h-7" />,
    'gcash': <Smartphone className="text-yellow w-7 h-7" />,
    'Cash on Delivery': <DollarSign className="text-yellow w-7 h-7" />,
};

// Backend values
const paymentOptions = ['paymaya', 'PayPal', 'gcash', 'Cash on Delivery'];

// UI display names
const methodLabels = {
    'gcash': 'GCash',
    'paymaya': 'Maya',
    'PayPal': 'PayPal',
    'Cash on Delivery': 'Cash on Delivery'
};

const PaymentMethod = ({ payment, setPayment }) => {
    return (
        <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-yellow/20 shadow-xl">
            <h3 className="text-2xl font-semibold text-yellow mb-6 flex items-center gap-2">
                <FaCreditCard className="text-yellow" size={20} />
                Payment Method
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {paymentOptions.map((method, index) => {
                    const isSelected = payment === method;

                    return (
                        <div
                            key={index}
                            onClick={() => setPayment(method)}
                            className={`flex items-center justify-between px-6 py-5 rounded-2xl cursor-pointer border-4 transition-all duration-200 group
              ${isSelected
                                    ? 'border-yellow bg-[#2a2a2a]'
                                    : 'border-[#2a2a2a] hover:border-yellow/60'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {methodIcons[method]}
                                <span className="text-white text-lg">
                                    {methodLabels[method] || method}
                                </span>
                            </div>

                            {isSelected ? (
                                <CheckCircle2 className="text-yellow w-6 h-6" />
                            ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-gray-500 group-hover:border-yellow/50"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PaymentMethod;