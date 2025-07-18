import React from 'react'
import BenefitBox from './BenefitBox'
import { FaLock, FaTruck, FaGift } from 'react-icons/fa'

const BenefitSection = ({ iconsRef, carouselImages, carouselIndex, carouselRef }) => {
    const benefitIcons = [
        { icon: <FaLock className="text-yellow text-xl" />, text: 'Secure & Encrypted' },
        { icon: <FaTruck className="text-yellow text-xl" />, text: 'Fast Delivery' },
        { icon: <FaGift className="text-yellow text-xl" />, text: 'Exclusive Perks' },
    ]

    return (
        <div className="md:col-span-3 bg-[#151515] flex flex-col items-center justify-center px-10 py-16">
            <div className="flex flex-col items-center text-center space-y-8 w-full max-w-3xl">
                <h2 className="text-4xl font-modern-negra text-yellow">Why Join Elixir?</h2>
                <div className="w-full space-y-4">
                    {benefitIcons.map((b, i) => (
                        <BenefitBox
                            key={i}
                            ref={el => iconsRef.current[i] = el}
                            icon={b.icon}
                            text={b.text}
                        />
                    ))}
                </div>

                <div ref={carouselRef} className="w-full h-80 rounded-xl overflow-hidden shadow-lg relative">
                    {carouselImages.map((img, idx) => (
                        <img
                            key={img}
                            src={img}
                            alt={`carousel-${idx}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out rounded-xl
                ${carouselIndex === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BenefitSection
