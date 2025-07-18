import React from 'react';

const ProductTable = ({ cartItems, onSelect, onSelectAll, onDelete, onQuantityChange }) => {
    return (
        <div className="lg:col-span-2 space-y-6 pb-32">
            {cartItems.length > 0 && (
                <div className="hidden md:grid grid-cols-12 p-6 rounded-2xl border border-yellow/20 text-gray-400 font-semibold text-sm mb-4 shadow-md backdrop-blur bg-gradient-to-r from-[#1a1a1a]/80 via-[#191919]/80 to-[#1a1a1a]/80">
                    <div className="col-span-5 flex items-center gap-4">
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 accent-yellow cursor-pointer"
                            checked={cartItems.every(item => item.selected)}
                            onChange={onSelectAll}
                        />
                        <span>Product</span>
                    </div>
                    <div className="col-span-2 text-center">Unit Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-center">Total Price</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>
            )}

            {cartItems.map(item => (
                <div
                    key={item.id}
                    id={`cart-item-${item.id}`}
                    onClick={() => onSelect(item.id)}
                    className={`cursor-pointer grid grid-cols-12 items-center gap-4 bg-[#1a1a1a] p-7 rounded-2xl shadow-xl border border-yellow/20 transition-all duration-300 hover:bg-[#1f1f1f] ${item.selected ? 'ring-2 ring-yellow' : ''
                        }`}
                >
                    <div className="col-span-5 flex items-center gap-4">
                        <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => onSelect(item.id)}
                            onClick={e => e.stopPropagation()}
                            className="form-checkbox h-5 w-5 accent-yellow cursor-pointer"
                        />
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-contain rounded-md border border-yellow/10"
                            onClick={e => e.stopPropagation()}
                        />
                        <div>
                            <h3 className="text-xl font-semibold text-yellow">{item.name}</h3>
                            <p className="text-sm italic text-gray-500">{item.subtitle}</p>
                        </div>
                    </div>

                    <div className="col-span-2 text-center text-white text-lg">
                        ${item.price.toFixed(2)}
                    </div>

                    <div className="col-span-2 flex justify-center items-center gap-3">
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                onQuantityChange(item.id, -1);
                            }}
                            className="size-10 aspect-square flex items-center justify-center bg-[#2a2a2a] rounded-full hover:bg-yellow hover:text-black hover:scale-105 transition-transform duration-150 text-lg"
                        >
                            -
                        </button>
                        <span className="text-lg">{item.quantity}</span>
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                onQuantityChange(item.id, 1);
                            }}
                            className="size-10 aspect-square flex items-center justify-center bg-[#2a2a2a] rounded-full hover:bg-yellow hover:text-black hover:scale-105 transition-transform duration-150 text-lg"
                        >
                            +
                        </button>
                    </div>

                    <div className="col-span-2 text-center text-white font-bold text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    <div className="col-span-1 text-right">
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                onDelete(item.id);
                            }}
                            className="text-sm text-red-400 hover:text-red-600"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductTable;
