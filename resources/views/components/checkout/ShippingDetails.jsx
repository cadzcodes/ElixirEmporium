import React from 'react';
import { Home as HomeIcon, Briefcase, Pencil } from 'lucide-react';
import { FaTruck } from 'react-icons/fa';


const ShippingDetails = ({ shipping, loading, onChange }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow"></div>
            </div>
        );
    }

    if (!shipping) {
        return (
            <div className="text-center text-gray-400 py-12">
                <p>No default shipping address found.</p>
            </div>
        );
    }

    return (
        <div className="relative border border-yellow/20 bg-[#1a1a1a] rounded-xl shadow-xl p-6">
            {/* Decorative Stripe */}
            <div
                className="absolute top-0 left-0 w-full h-[4px] rounded-t-xl"
                style={{
                    backgroundImage: `repeating-linear-gradient(
                        -45deg,
                        #f87171 0px,
                        #f87171 40px,
                        transparent 40px,
                        transparent 52px,
                        #60a5fa 52px,
                        #60a5fa 100px,
                        transparent 100px,
                        transparent 112px
                    )`
                }}
            ></div>

            <h3 className="text-2xl font-semibold text-yellow mb-6 flex items-center gap-3">
                <FaTruck className="text-yellow text-[1.3rem]" />
                <span>Shipping To:</span>
            </h3>



            <div className="relative border border-gray-700 bg-[#111111] rounded-lg p-4">
                <button
                    className="absolute top-3 right-3 flex items-center gap-1 text-sm text-yellow hover:underline"
                    onClick={() => console.log('Trigger address change')}
                >
                    <Pencil size={14} /> Change
                </button>

                <h4 className="text-xl text-white font-bold">
                    {shipping.name} <span className="text-sm text-gray-400">({shipping.phone})</span>
                </h4>
                <p className="mt-2 text-gray-300">{shipping.address1}</p>
                <p className="text-gray-300">{shipping.address2}</p>

                <div className="mt-4 flex justify-between items-center">
                    <div className="border border-yellow text-yellow px-3 py-1 rounded-full text-sm font-medium">
                        Default
                    </div>
                    <div className="text-sm text-gray-400 flex items-center gap-1">
                        {shipping.type === 'home' && (
                            <span className="flex items-center gap-1">
                                <HomeIcon size={16} className="text-yellow" /> Home
                            </span>
                        )}
                        {shipping.type === 'work' && (
                            <span className="flex items-center gap-1">
                                <Briefcase size={16} className="text-yellow" /> Work
                            </span>
                        )}
                        {!['home', 'work'].includes(shipping.type) && '—'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingDetails;
