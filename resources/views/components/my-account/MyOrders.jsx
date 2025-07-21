import React, { useState } from 'react';

const orders = [
    { id: 1, status: 'To Ship', product: 'Golden Rum', price: 59.99, qty: 1 },
    { id: 2, status: 'Completed', product: 'Luxury Vodka', price: 89.99, qty: 2 },
    { id: 3, status: 'Cancelled', product: 'Premium Whiskey', price: 120.00, qty: 1 },
];

const filterTabs = ['All', 'To Ship', 'To Receive', 'Completed', 'Cancelled'];

const MyOrders = () => {
    const [filter, setFilter] = useState('All');
    const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

    return (
        <div className="space-y-6">
            <h2 className="font-modern-negra text-5xl text-yellow mb-4">My Orders</h2>

            <div className="flex gap-4 mb-6 flex-wrap">
                {filterTabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-2 rounded-full border transition-all
              ${filter === tab ? 'bg-yellow text-black' : 'border-yellow/30 text-yellow hover:bg-yellow/10'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {filtered.map(order => (
                <div key={order.id} className="p-6 bg-[#1a1a1a] border border-yellow/20 rounded-xl shadow-md space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">{order.product}</h3>
                        <span className="text-sm text-yellow">{order.status}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                        <span>Qty: {order.qty}</span>
                        <span>Total: ${(order.price * order.qty).toFixed(2)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyOrders;
