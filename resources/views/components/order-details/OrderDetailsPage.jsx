import React from "react";
import { CheckCircle, Truck, PackageCheck, Star } from "lucide-react";
import { FaTruck, FaClipboardList } from "react-icons/fa";
import { Home as HomeIcon, Briefcase, Pencil } from "lucide-react";

const OrderProgress = ({ status }) => {
    const stages = [
        { label: "Order Placed", icon: <CheckCircle size={24} /> },
        { label: "To Ship", icon: <Truck size={24} /> },
        { label: "To Receive", icon: <PackageCheck size={24} /> },
        { label: "Completed", icon: <Star size={24} /> },
    ];

    const currentIndex = stages.findIndex((s) => s.label === status);

    const progressMap = {
        "Order Placed": 13, // slight start
        "To Ship": 37, // stops between first and second
        "To Receive": 63, // near last
        Completed: 100, // full bar
    };

    const progressPercent = progressMap[status] ?? 0;
    return (
        <div className="relative mb-12 px-4">
            {/* Background line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-700 z-0 rounded-full">
                <div
                    className="h-full bg-yellow rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Stage icons */}
            <div className="flex justify-between items-center relative z-10">
                {stages.map((stage, idx) => {
                    const isActive = idx <= currentIndex;
                    return (
                        <div
                            key={idx}
                            className="flex flex-col items-center flex-1 text-center"
                        >
                            <div
                                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 
                                    ${
                                        isActive
                                            ? "bg-yellow text-black border-yellow"
                                            : "bg-[#2a2a2a] border-gray-600 text-gray-400"
                                    }`}
                            >
                                {stage.icon}
                            </div>
                            <span
                                className={`${
                                    isActive
                                        ? "text-yellow font-semibold"
                                        : "text-gray-400 text-sm"
                                }`}
                            >
                                {stage.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const OrderActions = () => (
    <div className="flex justify-center gap-4 mb-12">
        <button className="px-5 py-3 bg-yellow text-black font-semibold rounded-lg hover:bg-yellow/90 transition">
            Order Received
        </button>
        <button className="px-5 py-3 border border-yellow text-yellow font-semibold rounded-lg hover:bg-yellow/20 transition">
            Request Return/Refund
        </button>
        <button className="px-5 py-3 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition">
            Contact Support
        </button>
    </div>
);

const ShippingAddress = ({ shipping }) => (
    <div className="relative border border-yellow/20 bg-[#1a1a1a] rounded-xl shadow-xl p-6 mb-12">
        <div className="absolute top-0 left-0 w-full h-[4px] rounded-t-xl bg-gradient-to-r from-yellow via-red-400 to-blue-400"></div>
        <h3 className="text-2xl font-semibold text-yellow mb-6 flex items-center gap-3">
            <FaTruck className="text-yellow text-[1.3rem]" />
            <span>Shipping Address:</span>
        </h3>
        <div className="relative border border-gray-700 bg-[#111111] rounded-lg p-4">
            <h4 className="text-xl text-white font-bold">
                {shipping.name}{" "}
                <span className="text-sm text-gray-400">
                    ({shipping.phone})
                </span>
            </h4>
            <p className="mt-2 text-gray-300">{shipping.address1}</p>
            <p className="text-gray-300">{shipping.address2}</p>
            <div className="mt-4 flex justify-between items-center">
                <div className="border border-yellow text-yellow px-3 py-1 rounded-full text-sm font-medium">
                    Default
                </div>
                <div className="text-sm text-gray-400 flex items-center gap-1">
                    {shipping.type === "home" && (
                        <span className="flex items-center gap-1">
                            <HomeIcon size={16} className="text-yellow" /> Home
                        </span>
                    )}
                    {shipping.type === "work" && (
                        <span className="flex items-center gap-1">
                            <Briefcase size={16} className="text-yellow" /> Work
                        </span>
                    )}
                </div>
            </div>
        </div>
    </div>
);

const ProductDetails = ({ items, shippingFee, total }) => {
    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-yellow/20 shadow-2xl">
            <h3 className="text-2xl font-semibold text-yellow mb-6 flex items-center gap-2">
                <FaClipboardList className="text-yellow" size={20} />
                Ordered Items:
            </h3>

            <div className="grid grid-cols-[1fr_140px_60px_140px] text-sm text-gray-500 uppercase px-2 pb-3 border-b border-yellow/10">
                <p className="col-span-1">Product</p>
                <p className="text-right">Unit Price</p>
                <p className="text-center">Qty</p>
                <p className="text-right">Subtotal</p>
            </div>

            <div className="divide-y divide-yellow/10 mt-4">
                {items.map((item, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-[1fr_140px_60px_140px] items-center gap-4 py-5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-[#2a2a2a] border border-yellow/10 rounded-lg flex items-center justify-center p-1">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                            <div>
                                <h4 className="text-base font-semibold text-white">
                                    {item.name}
                                </h4>
                                <p className="text-xs text-gray-500">
                                    750ml • Classic
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 text-right">
                            ₱{item.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-400 text-center">
                            {item.quantity}
                        </p>
                        <p className="text-lg font-semibold text-yellow text-right">
                            ₱{(item.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="border-t border-yellow/10 mt-8 pt-6 space-y-3 text-white/80 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span>₱{shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-yellow mt-2 pt-2 border-t border-yellow/20">
                    <span>Order Total</span>
                    <span>₱{total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

// Main Order Details Page
const OrderDetailsPage = ({ order }) => {
    return (
        <div className="pt-[100px] max-w-5xl mx-auto px-6 py-12 text-white">
            {/* Order Summary Section */}
            <div className="mb-10 text-white bg-[#111] border border-yellow/20 rounded-xl p-6 shadow-md min-h-[120px] flex items-center justify-center">
                {!order ? (
                    <div className="text-center text-white/70 text-sm">
                        Loading order...
                    </div>
                ) : (
                    <div className="w-full">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-yellow mb-1">
                                    Order #{order.id}
                                </h2>
                                <p className="text-sm text-gray-400">
                                    Placed on:{" "}
                                    {new Date(
                                        order.order_date
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-sm text-white/80">
                                <p>
                                    <span className="font-semibold text-white">
                                        Payment:
                                    </span>{" "}
                                    {order.payment_method}
                                </p>
                                <p>
                                    <span className="font-semibold text-white">
                                        ETA:
                                    </span>{" "}
                                    {new Date(order.eta).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Other Sections */}
            {order && (
                <>
                    <OrderProgress status={order.status} />
                    {/* <OrderActions /> */}
                    <ShippingAddress shipping={order.shipping} />
                    <ProductDetails
                        items={order.items}
                        shippingFee={order.shipping_fee}
                        total={order.total}
                    />
                </>
            )}
        </div>
    );
};
export default OrderDetailsPage;
