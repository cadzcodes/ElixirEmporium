import React, { useEffect, useState, Fragment } from 'react';
import OrderDetails from './OrderDetails';
import ShippingDetails from './ShippingDetails';
import PaymentMethod from './PaymentMethod';
import OrderSummary from './OrderSummary';
import { Dialog, Transition } from '@headlessui/react';
import { X, MapPin, PlusCircle, Trash2, Home as HomeIcon, Briefcase } from 'lucide-react';
import AddressForm from "../my-account/AddressForm";
import AddressSelector from "../reusables/AddressSelector";

const CheckoutForm = () => {
    const [shipping, setShipping] = useState(null);
    const [loadingAddress, setLoadingAddress] = useState(true);
    const [payment, setPayment] = useState('Credit Card');
    const [items, setItems] = useState([]);
    const [shake, setShake] = useState(false);
    const [showAddressDialog, setShowAddressDialog] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [showSelector, setShowSelector] = useState(false);


    // Fetch cart items from sessionStorage
    useEffect(() => {
        const stored = sessionStorage.getItem('checkoutItems');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setItems(parsed);
            } catch (err) {
                console.error('Invalid checkoutItems format in sessionStorage:', err);
            }
        }
    }, []);

    useEffect(() => {
        const stored = sessionStorage.getItem('checkoutItems');
        if (!stored) {
            window.location.href = '/cart'; // Redirect if no checkout items
        }
    }, []);

    // Fetch default shipping address
    useEffect(() => {
        const fetchDefaultAddress = async () => {
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
                const defaultAddr = data.find(addr => addr.is_default);

                if (defaultAddr) {
                    setShipping({
                        id: defaultAddr.id,
                        name: defaultAddr.full_name,
                        phone: defaultAddr.phone,
                        address1: defaultAddr.address,
                        address2: [defaultAddr.unit_number, defaultAddr.barangay, defaultAddr.city, defaultAddr.province].filter(Boolean).join(', '),
                        type: defaultAddr.type,
                    });
                }
            } catch (err) {
                console.error('Failed to fetch default address:', err);
            } finally {
                setLoadingAddress(false);
            }
        };

        fetchDefaultAddress();
    }, []);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = items.length > 0 ? 100 : 0;
    const total = subtotal + shippingFee;

    const handlePlaceOrder = async () => {
        if (!shipping) {
            // No shipping address — shake and block
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        try {
            const tokenElement = document.querySelector('meta[name="csrf-token"]');
            if (!tokenElement) throw new Error('CSRF token not found');
            const csrfToken = tokenElement.getAttribute('content');

            const response = await fetch('/orders/place', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({
                    items,
                    shipping_id: shipping.id,
                    payment_method: payment,
                }),
            });

            const result = await response.json();
            console.log("Sending items to backend:", items);

            if (response.ok) {
                sessionStorage.removeItem('checkoutItems');
                window.location.href = `/order-confirmation?order_id=${result.order_id}`;
            } else {
                console.error(result);
                alert('Failed to place order. Please try again.');
            }
        } catch (err) {
            console.error('Order placement error:', err);
            alert('Error placing order. See console for details.');
        }
    };


    return (
        <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
                <ShippingDetails
                    shipping={shipping}
                    loading={loadingAddress}
                    onChange={() => setShowSelector(true)}
                />
                <AddressSelector
                    open={showSelector}
                    selectedId={shipping?.id}
                    onClose={() => setShowSelector(false)}
                    onSelect={(selectedAddr) => setShipping(selectedAddr)}
                />
                <OrderDetails items={items} />
                <PaymentMethod payment={payment} setPayment={setPayment} />
            </div>

            <div className="lg:col-span-1">
                <div className="sticky top-[100px]">
                    <OrderSummary
                        subtotal={subtotal}
                        shippingFee={shippingFee}
                        total={total}
                        onPlaceOrder={handlePlaceOrder}
                        shake={shake}
                        hasShipping={!!shipping}
                    />
                </div>
            </div>

            <Transition appear show={showAddressDialog} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setShowAddressDialog(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
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
                            <Dialog.Panel className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#1a1a1a] p-8 text-white border border-yellow/20 shadow-2xl relative">
                                <button
                                    onClick={() => setShowAddressDialog(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                >
                                    <X />
                                </button>

                                <Dialog.Title className="text-2xl font-bold text-yellow mb-4">
                                    Add New Address
                                </Dialog.Title>

                                <AddressForm
                                    isEditing={false}
                                    initialData={{ default: true }}
                                    onSave={async (formData) => {
                                        // Force isDefault = true even if user unchecked it
                                        formData.isDefault = true;

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
                                                    is_default: true, // Force true
                                                }),
                                            });

                                            const result = await response.json();
                                            if (response.ok) {
                                                const saved = result.address;

                                                setShipping({
                                                    id: saved.id,
                                                    name: saved.full_name,
                                                    phone: saved.phone,
                                                    address1: saved.address,
                                                    address2: [saved.unit_number, saved.barangay, saved.city, saved.province]
                                                        .filter(Boolean)
                                                        .join(', '),
                                                    type: saved.type,
                                                });
                                                setShowAddressDialog(false);
                                            } else {
                                                throw new Error(result.message || 'Failed to save address');
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            alert('Failed to save address.');
                                        }
                                    }}
                                    onCancel={() => setShowAddressDialog(false)}
                                />
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default CheckoutForm;
