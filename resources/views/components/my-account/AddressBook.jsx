import React from 'react';

const addresses = [
    {
        id: 1,
        name: 'John Doe',
        phone: '1234567890',
        address1: '123 Luxury Lane',
        address2: 'Gold District',
        default: true,
        type: 'Home',
    },
    {
        id: 2,
        name: 'Jane Smith',
        phone: '0987654321',
        address1: '456 Chic Avenue',
        address2: 'Silver Block',
        default: false,
        type: '',
    },
];

const AddressBook = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="font-modern-negra text-5xl text-yellow">Address Book</h2>
                <button className="bg-yellow text-black px-5 py-2 rounded-lg hover:bg-white">+ Add New Address</button>
            </div>

            {addresses.map(addr => (
                <div key={addr.id} className="border border-yellow/20 p-6 rounded-xl mb-6 bg-[#1a1a1a]">
                    <div className="flex justify-between">
                        <h3 className="text-xl text-white font-bold">{addr.name} <span className="text-sm text-gray-400">({addr.phone})</span></h3>
                        <button className="text-yellow hover:underline">Edit</button>
                    </div>
                    <p className="mt-2 text-gray-300">{addr.address1}</p>
                    <p className="text-gray-300">{addr.address2}</p>

                    <div className="flex justify-between items-center mt-4">
                        {addr.default ? (
                            <div className="border border-yellow text-yellow px-3 py-1 rounded-full text-sm font-medium">Default</div>
                        ) : (
                            <button className="text-sm text-yellow hover:underline">Set as default</button>
                        )}
                        <span className="text-sm text-gray-400">{addr.type || '—'}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AddressBook;
