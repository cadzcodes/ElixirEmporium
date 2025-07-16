import React from 'react'

const ShippingDetails = ({ shipping, setShipping }) => {
    return (
        <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-yellow/20 shadow-xl">
            <h3 className="text-2xl font-semibold text-yellow mb-4">Shipping Details</h3>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-[#2a2a2a] border border-yellow/10 text-white p-3 rounded-md focus:outline-yellow"
                    value={shipping.name}
                    onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Shipping Address"
                    className="w-full bg-[#2a2a2a] border border-yellow/10 text-white p-3 rounded-md focus:outline-yellow"
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Contact Number"
                    className="w-full bg-[#2a2a2a] border border-yellow/10 text-white p-3 rounded-md focus:outline-yellow"
                    value={shipping.contact}
                    onChange={(e) => setShipping({ ...shipping, contact: e.target.value })}
                />
            </div>
        </div>
    );
};

export default ShippingDetails;
