import React from 'react'

const BenefitBox = React.forwardRef(({ icon, text }, ref) => (
    <div
        ref={ref}
        className="flex items-center gap-4 text-white text-lg bg-[#1e1e1e] px-6 py-4 rounded-xl shadow-inner w-full"
    >
        <div className="text-yellow text-2xl">{icon}</div>
        <p className="text-white">{text}</p>
    </div>
))

export default BenefitBox
