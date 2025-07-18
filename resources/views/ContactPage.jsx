import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ReactDOM from 'react-dom/client';
import Navbar from "./components/Navbar";
import AccordionItem from "./components/contact/AccordionItem";
import SmoothFollower from "./components/Cursor";

gsap.registerPlugin(ScrollTrigger)

const ContactPage = () => {
    const formRef = useRef(null)
    const sectionRef = useRef(null)
    const ctaRef = useRef(null)

    useEffect(() => {
        gsap.from(sectionRef.current, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
            },
        })

        gsap.from(formRef.current, {
            opacity: 0,
            y: 50,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: formRef.current,
                start: 'top 80%',
            },
        })

        gsap.from(ctaRef.current, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: ctaRef.current,
                start: 'top 80%',
            },
        })
    }, [])

    return (
        <div>
            <SmoothFollower />
            <Navbar />
            <section className="bg-[#0e0e0e] text-white min-h-screen pt-40 pb-24 px-6 md:px-16 overflow-hidden">

                {/* Header */}
                <div
                    ref={sectionRef}
                    className="text-center mb-20 max-w-3xl mx-auto"
                >
                    <h2 className="text-yellow text-5xl md:text-6xl font-modern-negra tracking-widest leading-tight mb-4">
                        Contact and Reservations
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Have a special request, private tasting, or business inquiry? Our door is always open.
                    </p>
                </div>

                {/* Contact Form Section */}
                <div
                    ref={formRef}
                    className="max-w-4xl mx-auto bg-[#1a1a1a] p-10 rounded-2xl shadow-2xl border border-yellow/30 backdrop-blur-md"
                >
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="col-span-1">
                            <label className="block text-sm mb-2 text-yellow">Full Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-yellow"
                                placeholder="Your name"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm mb-2 text-yellow">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-yellow"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm mb-2 text-yellow">Message</label>
                            <textarea
                                rows="5"
                                className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-yellow"
                                placeholder="Tell us what’s on your mind..."
                            ></textarea>
                        </div>

                        <div className="col-span-1 md:col-span-2 text-center">
                            <button
                                type="submit"
                                className="bg-yellow text-black font-semibold py-3 px-10 rounded-full hover:bg-white transition duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                            >
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>

                {/* Separator */}
                <div className="mt-32 border-t border-yellow/20 w-1/2 mx-auto"></div>

                {/* Customer Support Section - Simple CTA Button */}
                <div ref={ctaRef} className="mt-24 text-center text-white">
                    <h3 className="text-3xl md:text-4xl font-modern-negra text-yellow mb-6">
                        Need Immediate Assistance
                    </h3>
                    <p className="text-gray-400 text-lg mb-8">
                        Our support team is available 24/7 to help you out.
                    </p>
                    <button
                        onClick={() => alert('Launching support chat or redirecting...')}
                        className="bg-yellow text-black font-semibold py-3 px-8 rounded-full hover:bg-white transition duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                    >
                        Talk to Customer Support
                    </button>
                </div>

                {/* Separator */}
                <div className="mt-32 border-t border-yellow/20 w-1/2 mx-auto"></div>

                {/* Customer Support Accordion */}
                <div className="mt-24 text-center text-white max-w-3xl mx-auto space-y-6">
                    <h3 className="text-3xl md:text-4xl font-modern-negra text-yellow mb-6">
                        Customer Support
                    </h3>
                    <p className="text-gray-400 text-lg mb-8">
                        Have questions? We have answers.
                    </p>

                    <AccordionItem
                        question="What is the usual response time?"
                        answer="Our team typically responds within 1–2 hours during business days."
                    />
                    <AccordionItem
                        question="Can I modify my reservation?"
                        answer="Yes, simply reach out via our contact form or use the support button above."
                    />
                    <AccordionItem
                        question="Is walk-in service available?"
                        answer="We encourage reservations; however, walk-ins are welcome based on availability."
                    />
                </div>


                {/* Contact Details Section (Footer) */}
                <div className="text-center mt-20 space-y-4 text-gray-400">
                    <p className="text-xl font-medium">📍 123 Velvet Ave, Golden City</p>
                    <p className="text-xl font-medium">📞 +1 (800) 555-ELXR</p>
                    <p className="text-xl font-medium">📧 contact@elixiremporium.com</p>
                </div>
            </section>
        </div>
    )
}

const rootElement = document.getElementById('contactPage');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<ContactPage />);
} else {
    console.error("No element with id 'Contact Page' found.");
}
