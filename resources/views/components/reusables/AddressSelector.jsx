import React, { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Home as HomeIcon, Briefcase, MapPin, CheckCircle2 } from 'lucide-react';

const AddressSelector = ({ open, onClose, selectedId, onSelect }) => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAddresses = async () => {
            setLoading(true);
            try {
                const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                const res = await fetch('/addresses', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': token,
                    },
                    credentials: 'include',
                });
                const data = await res.json();
                const formatted = data.map(addr => ({
                    id: addr.id,
                    name: addr.full_name,
                    phone: addr.phone,
                    address1: addr.address,
                    address2: [addr.unit_number, addr.barangay, addr.city, addr.province].filter(Boolean).join(', '),
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

        if (open) fetchAddresses();
    }, [open]);

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                        <Dialog.Panel className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#1a1a1a] p-8 text-white border border-yellow/20 shadow-2xl relative">
                            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                                <X />
                            </button>

                            <Dialog.Title className="text-2xl font-bold text-yellow mb-6 flex items-center gap-2">
                                <MapPin size={22} /> Select Shipping Address
                            </Dialog.Title>

                            {loading ? (
                                <div className="flex justify-center items-center py-24">
                                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-yellow" />
                                </div>
                            ) : addresses.length === 0 ? (
                                <p className="text-gray-400 text-center">You have no saved addresses.</p>
                            ) : (
                                <div className="grid gap-6">
                                    {addresses.map(addr => {
                                        const isSelected = selectedId === addr.id;
                                        return (
                                            <div
                                                key={addr.id}
                                                onClick={() => {
                                                    onSelect(addr);
                                                    onClose();
                                                }}
                                                className={`cursor-pointer p-5 rounded-xl border-4 transition 
                                                    ${isSelected ? 'border-yellow bg-[#2a2a2a]' : 'border-[#2a2a2a] hover:border-yellow/50'}
                                                    flex justify-between items-start gap-4`}
                                            >
                                                <div>
                                                    <h4 className="text-xl font-semibold text-white">
                                                        {addr.name} <span className="text-sm text-gray-400">({addr.phone})</span>
                                                    </h4>
                                                    <p className="mt-1 text-gray-300">{addr.address1}</p>
                                                    <p className="text-gray-300">{addr.address2}</p>
                                                    <div className="mt-2 text-sm text-gray-400 flex items-center gap-1">
                                                        {addr.type === 'home' && <><HomeIcon size={16} className="text-yellow" /> Home</>}
                                                        {addr.type === 'work' && <><Briefcase size={16} className="text-yellow" /> Work</>}
                                                        {!['home', 'work'].includes(addr.type) && '—'}
                                                    </div>
                                                </div>

                                                {isSelected ? (
                                                    <CheckCircle2 className="text-yellow w-6 h-6" />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full border-2 border-gray-500"></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AddressSelector;
