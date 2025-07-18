import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'
import ReactDOM from 'react-dom/client';
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SignupForm from "./components/signup/SignupForm"
import BenefitSection from "./components/signup/BenefitSection"
import Toast from "./components/signup/Toast"
import Navbar from "./components/Navbar";
import SmoothFollower from "./components/Cursor";


gsap.registerPlugin(ScrollTrigger)

const carouselImages = [
    '/images/perk1.jpg',
    '/images/perk2.jpg',
    '/images/perk3.jpg',
]

const SignupPage = () => {
    const formRef = useRef(null)
    const toastRef = useRef(null)
    const iconsRef = useRef([])
    const carouselRef = useRef(null)

    const [toggle, setToggle] = useState(true)
    const [status, setStatus] = useState(null)
    const [carouselIndex, setCarouselIndex] = useState(0)

    useEffect(() => {
        gsap.from(formRef.current, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power4.out',
        })

        iconsRef.current.forEach((el, i) => {
            gsap.fromTo(
                el,
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: 'back.out(1.7)',
                    delay: i * 0.3,
                    repeat: -1,
                    yoyo: true,
                }
            )
        })

        const interval = setInterval(() => {
            setCarouselIndex(prev => (prev + 1) % carouselImages.length)
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    useLayoutEffect(() => {
        if (!status || !toastRef.current) return
        const tl = gsap.timeline()

        tl.fromTo(
            toastRef.current,
            { y: 50, opacity: 0, scale: 0.9 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: 'back.out(1.7)',
            }
        ).to(toastRef.current, {
            opacity: 0,
            y: -20,
            delay: 2,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => setStatus(null),
        })
    }, [status])

    const handleSignup = (e) => {
        e.preventDefault()
        const isSuccess = toggle
        setStatus(isSuccess ? 'success' : 'error')
        setToggle(!toggle)
    }

    return (
        <main>
            <SmoothFollower />
            <Navbar/>
            <div className="min-h-screen bg-[#0e0e0e] text-white grid md:grid-cols-5">
                <Toast ref={toastRef} status={status} />
                <SignupForm formRef={formRef} handleSignup={handleSignup} />
                <BenefitSection
                    iconsRef={iconsRef}
                    carouselImages={carouselImages}
                    carouselIndex={carouselIndex}
                    carouselRef={carouselRef}
                />
            </div>
        </main>
    )
}

const rootElement = document.getElementById('signupPage')

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<SignupPage />)
} else {
    console.error("No element with id 'signupPage' found.")
}