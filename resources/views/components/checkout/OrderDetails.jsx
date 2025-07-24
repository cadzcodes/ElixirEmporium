import React from 'react';
import { FaClipboardList } from 'react-icons/fa';

const OrderDetails = ({ items }) => {
    return (
        <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-yellow/20 shadow-2xl">
            <h3 className="text-2xl font-semibold text-yellow mb-6 flex items-center gap-2">
                <FaClipboardList className="text-yellow" size={20} />
                Order Details:
            </h3>

            {/* Headings */}
            <div className="grid grid-cols-[1fr_160px_60px_160px] text-sm text-gray-500 uppercase px-2 pb-3 border-b border-yellow/10">
                <p className="col-span-1">Product</p>
                <p className="text-right">Unit Price</p>
                <p className="text-center">Qty</p>
                <p className="text-right">Subtotal</p>
            </div>

            <div className="divide-y divide-yellow/10 mt-4">
                {items.map((item, i) => (
                    <div key={i} className="grid grid-cols-[1fr_160px_60px_160px] items-center gap-4 py-5">
                        {/* Product Info */}
                        <div className="flex items-center gap-4">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 rounded-lg border border-yellow/10 object-cover shadow-sm"
                            />
                            <div>
                                <h4 className="text-base font-semibold text-white">{item.name}</h4>
                                <p className="text-xs text-gray-500">750ml • Classic</p>
                            </div>
                        </div>

                        {/* Unit Price */}
                        <p className="text-sm text-gray-400 text-right">₱{item.price.toFixed(2)}</p>

                        {/* Quantity */}
                        <p className="text-sm text-gray-400 text-center">{item.quantity}</p>

                        {/* Subtotal */}
                        <p className="text-lg font-semibold text-yellow text-right">
                            ₱{(item.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderDetails;
