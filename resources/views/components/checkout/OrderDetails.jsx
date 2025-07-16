import React from 'react'

const OrderDetails = ({ items }) => {
    return (
        <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-yellow/20 shadow-xl">
            <h3 className="text-2xl font-semibold text-yellow mb-4">Order Details</h3>
            <div className="space-y-6">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <img src={item.image} className="w-16 h-16 rounded-md border border-yellow/10" />
                            <div>
                                <h4 className="text-lg font-semibold">{item.name}</h4>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                        </div>
                        <p className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderDetails;
