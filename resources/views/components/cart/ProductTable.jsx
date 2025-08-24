import React from "react";
import FancyCheckbox from "../reusables/FancyCheckbox";

const ProductTable = ({
    cartItems,
    onSelect,
    onSelectAll,
    onDelete,
    onQuantityChange,
}) => {
    return (
        <div className="lg:col-span-2 space-y-6 pb-32">
            {cartItems.length > 0 && (
                <div className="hidden md:grid grid-cols-12 p-6 rounded-2xl border border-yellow/20 text-gray-400 font-semibold text-sm mb-4 shadow-md backdrop-blur bg-gradient-to-r from-[#1a1a1a]/80 via-[#191919]/80 to-[#1a1a1a]/80">
                    <div className="col-span-5 flex items-center gap-4">
                        <FancyCheckbox
                            checked={cartItems.every((item) => item.selected)}
                            onChange={onSelectAll}
                            className="mt-1"
                        />
                        <span>Product</span>
                    </div>
                    <div className="col-span-2 text-center">Unit Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-center">Total Price</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>
            )}

            {cartItems.map((item) => (
                <div
                    key={item.id}
                    id={`cart-item-${item.id}`}
                    onClick={() => onSelect(item.id)}
                    className={`cursor-pointer bg-[#1a1a1a] p-5 md:p-7 rounded-2xl shadow-xl border border-yellow/20 transition-all duration-300 hover:bg-[#1f1f1f] 
    ${item.selected ? "ring-2 ring-yellow" : ""}`}
                >
                    <div className="grid md:grid-cols-12 gap-4">
                        {/* Product */}
                        <div className="md:col-span-5 flex gap-4 items-center">
                            <FancyCheckbox
                                checked={item.selected}
                                onChange={() => onSelect(item.id)}
                                className="mt-1"
                            />
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-contain rounded-md border border-yellow/10"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex-1">
                                <h3 className="text-lg md:text-xl font-bold text-yellow">
                                    {item.name}
                                </h3>
                                <p className="text-sm italic text-gray-500">
                                    750ml • Classic
                                </p>
                            </div>
                        </div>

                        {/* Desktop Price */}
                        <div className="hidden md:flex md:col-span-2 justify-center items-center text-white text-lg">
                            ₱{item.price.toFixed(2)}
                        </div>

                        {/* Desktop Quantity with Input */}
                        <div className="hidden md:flex md:col-span-2 justify-center items-center gap-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (item.quantity > 1)
                                        onQuantityChange(item.id, -1);
                                }}
                                className="size-10 flex items-center justify-center bg-[#2a2a2a] rounded-full hover:bg-yellow hover:text-black hover:scale-105 transition"
                            >
                                -
                            </button>

                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={item.quantity}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    let newQty = parseInt(e.target.value, 10);
                                    if (isNaN(newQty)) newQty = 1;
                                    if (newQty < 1) newQty = 1;
                                    if (newQty > 10) newQty = 10;
                                    onQuantityChange(
                                        item.id,
                                        newQty - item.quantity
                                    );
                                }}
                                className="w-16 text-center bg-[#2a2a2a] border border-yellow/30 rounded-lg text-white text-lg 
               focus:ring-2 focus:ring-yellow focus:outline-none 
               appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (item.quantity < 10)
                                        onQuantityChange(item.id, 1);
                                }}
                                className="size-10 flex items-center justify-center bg-[#2a2a2a] rounded-full hover:bg-yellow hover:text-black hover:scale-105 transition"
                            >
                                +
                            </button>
                        </div>

                        {/* Desktop Total */}
                        <div className="hidden md:flex md:col-span-2 justify-center items-center text-white font-bold text-lg">
                            ₱{(item.price * item.quantity).toFixed(2)}
                        </div>

                        {/* Desktop Remove */}
                        <div className="hidden md:flex md:col-span-1 justify-end items-center">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(item.id);
                                }}
                                className="text-sm text-red-400 hover:text-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    </div>

                    {/* Mobile Extra Info */}
                    <div className="md:hidden mt-4 space-y-3">
                        {/* Price */}
                        <div className="w-full bg-[#2a2a2a] px-4 py-2 rounded-xl flex justify-between text-white text-sm">
                            <span className="text-gray-400">Unit Price</span>
                            <span>₱{item.price.toFixed(2)}</span>
                        </div>

                        {/* Quantity with Input */}
                        <div className="w-full bg-[#2a2a2a] px-4 py-2 rounded-xl flex justify-between items-center">
                            <span className="text-gray-400 text-sm">
                                Quantity
                            </span>
                            <div className="flex gap-3 items-center">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (item.quantity > 1)
                                            onQuantityChange(item.id, -1);
                                    }}
                                    className="w-8 h-8 flex items-center justify-center bg-yellow text-black font-bold rounded-full hover:scale-110 transition"
                                >
                                    -
                                </button>

                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={item.quantity}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        let newQty = parseInt(
                                            e.target.value,
                                            10
                                        );
                                        if (isNaN(newQty)) newQty = 1;
                                        if (newQty < 1) newQty = 1;
                                        if (newQty > 10) newQty = 10;
                                        onQuantityChange(
                                            item.id,
                                            newQty - item.quantity
                                        );
                                    }}
                                    className="w-14 text-center bg-black/30 border border-yellow/40 rounded-lg text-white text-lg focus:ring-2 focus:ring-yellow focus:outline-none"
                                />

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (item.quantity < 10)
                                            onQuantityChange(item.id, 1);
                                    }}
                                    className="w-8 h-8 flex items-center justify-center bg-yellow text-black font-bold rounded-full hover:scale-110 transition"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="w-full bg-[#2a2a2a] px-4 py-2 rounded-xl flex justify-between text-white text-sm">
                            <span className="text-gray-400">Total</span>
                            <span className="font-bold text-lg">
                                ₱{(item.price * item.quantity).toFixed(2)}
                            </span>
                        </div>

                        {/* Remove Button */}
                        <div className="w-full px-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(item.id);
                                }}
                                className="w-full flex justify-center items-center gap-2 p-3 bg-red-900/60 hover:bg-red-700 rounded-xl text-red-300 hover:text-white transition"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6"
                                    />
                                </svg>
                                <span>Remove</span>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductTable;
