import React, { useState, useEffect } from "react";

const QuantityInput = ({ quantity, onChange }) => {
    const [tempQty, setTempQty] = useState(quantity);

    // Update tempQty if quantity changes from parent
    useEffect(() => {
        setTempQty(quantity);
    }, [quantity]);

    const handleBlur = () => {
        let newQty = parseInt(tempQty, 10);
        if (isNaN(newQty) || newQty < 1) newQty = 1;
        if (newQty > 10) newQty = 10;
        setTempQty(newQty);
        if (newQty !== quantity) onChange(newQty - quantity);
    };

    const handleChange = (e) => {
        setTempQty(e.target.value); // allow free typing
    };

    return (
        <input
            type="number"
            min="1"
            max="10"
            value={tempQty}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    e.target.blur();
                }
            }}
            className="w-16 text-center bg-[#2a2a2a] border border-yellow/30 rounded-lg text-white text-lg 
        focus:ring-2 focus:ring-yellow focus:outline-none 
        appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
    );
};
