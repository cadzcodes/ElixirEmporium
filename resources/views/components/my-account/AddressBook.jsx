import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, MapPin, PlusCircle, Trash2, Home as HomeIcon, Briefcase } from 'lucide-react';
import AddressForm from './AddressForm';

const AddressBook = () => {
    const [addresses, setAddresses] = useState(window.__ADDRESSES__ || []);
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAddresses = async () => {
            setLoading(true);
            try {
                const tokenElement = document.querySelector('meta[name="csrf-token"]');
                if (!tokenElement) throw new Error('CSRF token not found');

                const csrfToken = tokenElement.getAttribute('content');

                const res = await fetch('/addresses', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    credentials: 'include',
                });

                const data = await res.json();

                const formatted = data.map(addr => ({
                    id: addr.id,
                    name: addr.full_name,
                    phone: addr.phone,
                    address1: addr.address,
                    address2: `${addr.unit_number}, ${addr.barangay}, ${addr.city}, ${addr.province}`,
                    default: addr.is_default,
                    type: addr.type,
                }));

                setAddresses(formatted);
            } catch (err) {
                console.error('Failed to fetch addresses:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAddresses();
    }, []);

    const handleSave = async (formData) => {
        try {
            const tokenElement = document.querySelector('meta[name="csrf-token"]');
            if (!tokenElement) throw new Error('CSRF token not found');

            const csrfToken = tokenElement.getAttribute('content');

            const response = await fetch('/addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({
                    full_name: formData.fullName,
                    phone: formData.phone,
                    address: formData.address,
                    unit_number: formData.unitNumber,
                    province: formData.province,
                    city: formData.city,
                    barangay: formData.barangay,
                    type: formData.type,
                    is_default: formData.isDefault,
                }),
            });

            if (!response.ok) throw new Error('Failed to save address');

            const resJson = await response.json();
            const saved = resJson.address;

            const formattedAddress = {
                id: saved.id,
                name: saved.full_name,
                phone: saved.phone,
                address1: saved.address,
                address2: [saved.unit_number, saved.barangay, saved.city, saved.province].filter(Boolean).join(', '),
                default: saved.is_default,
                type: saved.type,
            };

            setAddresses(prev => [...prev, formattedAddress]);
            setShowDialog(false);
        } catch (error) {
            console.error('Error saving address:', error);
        }
    };


    const handleDelete = async (id) => {
        try {
            const tokenElement = document.querySelector('meta[name="csrf-token"]');
            if (!tokenElement) throw new Error('CSRF token not found');

            const csrfToken = tokenElement.getAttribute('content');

            const res = await fetch(`/addresses/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to delete address');

            setAddresses(prev => prev.filter(addr => addr.id !== id));
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="font-modern-negra text-4xl md:text-5xl text-yellow">Address Book</h2>
                <button
                    onClick={() => setShowDialog(true)}
                    className="bg-yellow text-black px-5 py-2 rounded-lg hover:bg-white"
                >
                    + Add New Address
                </button>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center py-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow"></div>
                </div>
            ) : addresses.length === 0 ? (
                <div className="bg-[#1a1a1a] border border-yellow/20 rounded-xl p-12 text-center text-gray-400 shadow-xl">
                    <MapPin className="mx-auto mb-4 text-yellow" size={48} />
                    <h3 className="text-2xl text-white font-bold mb-2">No Addresses Yet</h3>
                    <p className="text-sm text-gray-400 mb-6">
                        Add your shipping or delivery addresses so you can quickly check out without filling forms again.
                    </p>
                    <button
                        onClick={() => setShowDialog(true)}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-yellow text-black font-semibold rounded-lg hover:bg-white transition"
                    >
                        <PlusCircle size={18} /> Add Your First Address
                    </button>
                </div>
            ) : (
                addresses.map(addr => (
                    <div
                        key={addr.id}
                        className="border border-yellow/20 p-6 rounded-xl mb-6 bg-[#1a1a1a] shadow-md"
                    >
                        <div className="flex justify-between">
                            <h3 className="text-xl text-white font-bold">
                                {addr.name} <span className="text-sm text-gray-400">({addr.phone})</span>
                            </h3>
                            <div className="flex items-center gap-3">
                                <button className="text-yellow hover:underline">Edit</button>
                                {!addr.default && (
                                    <button
                                        onClick={() => handleDelete(addr.id)}
                                        className="text-red-500 hover:text-red-300 transition"
                                        title="Delete Address"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <p className="mt-2 text-gray-300">{addr.address1}</p>
                        <p className="text-gray-300">{addr.address2}</p>

                        <div className="flex justify-between items-center mt-4">
                            {addr.default ? (
                                <div className="border border-yellow text-yellow px-3 py-1 rounded-full text-sm font-medium">
                                    Default
                                </div>
                            ) : (
                                <button className="text-sm text-yellow hover:underline">
                                    Set as default
                                </button>
                            )}
                            <span className="text-sm text-gray-400 flex items-center gap-1">
                                {addr.type === 'home' && (
                                    <span className="flex items-center gap-1">
                                        <HomeIcon size={16} className="text-yellow" /> Home
                                    </span>
                                )}
                                {addr.type === 'work' && (
                                    <span className="flex items-center gap-1">
                                        <Briefcase size={16} className="text-yellow" /> Work
                                    </span>
                                )}
                                {!['home', 'work'].includes(addr.type) && '—'}

                            </span>
                        </div>
                    </div>
                ))

            )}

            {/* Address Form Dialog */}
            <Transition appear show={showDialog} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setShowDialog(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/70" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl rounded-2xl bg-[#1a1a1a] p-8 text-white border border-yellow/20 shadow-2xl relative">
                                <button
                                    onClick={() => setShowDialog(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                >
                                    <X />
                                </button>
                                <Dialog.Title className="text-2xl font-bold text-yellow mb-4">
                                    Add New Address
                                </Dialog.Title>

                                <AddressForm
                                    onSave={handleSave}
                                    onCancel={() => setShowDialog(false)}
                                />
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default AddressBook;