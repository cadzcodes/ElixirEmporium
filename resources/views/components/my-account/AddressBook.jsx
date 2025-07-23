import React, { useState, Fragment, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, MapPin, PlusCircle, Trash2, Home as HomeIcon, Briefcase } from 'lucide-react';
import AddressForm from './AddressForm';
import gsap from 'gsap';
import Flip from 'gsap/Flip';

gsap.registerPlugin(Flip);

const AddressBook = () => {
    const [addresses, setAddresses] = useState(window.__ADDRESSES__ || []);
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const listRef = useRef(null);
    const [editingAddress, setEditingAddress] = useState(null);


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

    const sortedAddresses = [...addresses].sort((a, b) => (b.default ? 1 : 0) - (a.default ? 1 : 0));

    const handleUpdate = async (id, formData) => {
        try {
            const tokenElement = document.querySelector('meta[name="csrf-token"]');
            if (!tokenElement) throw new Error('CSRF token not found');
            const csrfToken = tokenElement.getAttribute('content');

            const response = await fetch(`/addresses/${id}`, {
                method: 'PUT',
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

            if (!response.ok) throw new Error('Failed to update address');

            const updated = (await response.json()).address;

            setAddresses(prev =>
                prev.map(addr => ({
                    ...addr,
                    ...(addr.id === updated.id
                        ? {
                            name: updated.full_name,
                            phone: updated.phone,
                            address1: updated.address,
                            address2: [updated.unit_number, updated.barangay, updated.city, updated.province].filter(Boolean).join(', '),
                            default: updated.is_default,
                            type: updated.type,
                        }
                        : addr.default && updated.is_default
                            ? { ...addr, default: false }
                            : addr),
                })).sort((a, b) => (b.default ? 1 : 0) - (a.default ? 1 : 0))
            );
        } catch (error) {
            console.error('Error updating address:', error);
        }
    };


    const handleSetDefault = async (id) => {
        try {
            const tokenElement = document.querySelector('meta[name="csrf-token"]');
            if (!tokenElement) throw new Error('CSRF token not found');
            const csrfToken = tokenElement.getAttribute('content');

            const state = Flip.getState('.address-card');

            const res = await fetch(`/addresses/${id}/default`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to set default address');

            const { address: updatedDefault } = await res.json();

            setAddresses(prev =>
                prev.map(addr => ({
                    ...addr,
                    default: addr.id === updatedDefault.id,
                }))
            );

            requestAnimationFrame(() => {
                Flip.from(state, {
                    duration: 0.5,
                    ease: 'power2.inOut',
                    stagger: 0.02,
                    nested: true,
                });
            });
        } catch (error) {
            console.error('Failed to set default address:', error);
        }
    };

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

            setAddresses(prev => {
                const updated = formattedAddress.default
                    ? prev.map(addr => ({ ...addr, default: false }))
                    : prev;

                const newList = [...updated, formattedAddress];
                return newList.sort((a, b) => (b.default ? 1 : 0) - (a.default ? 1 : 0));
            });

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

            {loading ? (
                <div className="flex justify-center items-center py-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow"></div>
                </div>
            ) : sortedAddresses.length === 0 ? (
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
                <div ref={listRef}>
                    {sortedAddresses.map(addr => (
                        <div
                            key={addr.id}
                            className="address-card border border-yellow/20 p-6 rounded-xl mb-6 bg-[#1a1a1a] shadow-md"
                        >
                            <div className="flex justify-between">
                                <h3 className="text-xl text-white font-bold">
                                    {addr.name} <span className="text-sm text-gray-400">({addr.phone})</span>
                                </h3>
                                <div className="flex items-center gap-3">
                                    <button
                                        className="text-yellow hover:underline"
                                        onClick={() => {
                                            setEditingAddress(addr);
                                            setShowDialog(true);
                                        }}
                                    >
                                        Edit
                                    </button>

                                    {!addr.default && (
                                        <button
                                            onClick={() => {
                                                setAddressToDelete(addr);
                                                setShowDeleteDialog(true);
                                            }}
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
                                    <button
                                        className="text-sm text-yellow hover:underline"
                                        onClick={() => handleSetDefault(addr.id)}
                                    >
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
                    ))}
                </div>
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
                                    initialData={editingAddress}
                                    isEditing={!!editingAddress}
                                    onSave={async (formData) => {
                                        if (editingAddress) {
                                            await handleUpdate(editingAddress.id, formData);
                                        } else {
                                            await handleSave(formData);
                                        }
                                        setEditingAddress(null);
                                        setShowDialog(false);
                                    }}
                                    onDelete={editingAddress ? async () => {
                                        await handleDelete(editingAddress.id);
                                        setEditingAddress(null);
                                        setShowDialog(false);
                                    } : null}
                                    onCancel={() => {
                                        setEditingAddress(null);
                                        setShowDialog(false);
                                    }}
                                />

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={showDeleteDialog} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setShowDeleteDialog(false)}>
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
                            <Dialog.Panel className="w-full max-w-md rounded-xl bg-[#1a1a1a] p-6 text-white border border-red-500/30 shadow-2xl relative">
                                <div className="flex flex-col items-center text-center">
                                    <Trash2 size={48} className="text-red-500 mb-4" />
                                    <Dialog.Title className="text-2xl font-bold text-red-500 mb-2">
                                        Confirm Deletion
                                    </Dialog.Title>
                                    <p className="text-gray-300 mb-6">
                                        Are you sure you want to delete the address for{' '}
                                        <span className="text-white font-semibold">
                                            {addressToDelete?.name}
                                        </span>
                                        ?
                                        This action cannot be undone.
                                    </p>

                                    <div className="flex gap-4 justify-center">
                                        <button
                                            onClick={() => setShowDeleteDialog(false)}
                                            className="px-4 py-2 rounded-lg border border-gray-500 text-gray-300 hover:text-white hover:border-white transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (!addressToDelete) return;
                                                await handleDelete(addressToDelete.id);
                                                setShowDeleteDialog(false);
                                                setAddressToDelete(null);
                                            }}
                                            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                                        >
                                            Yes, Delete
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>

        </div>
    );
};

export default AddressBook;
