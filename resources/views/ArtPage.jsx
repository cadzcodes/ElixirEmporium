import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ReactDOM from 'react-dom/client';
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroSection from './components/art/HeroSection'
import ShowcaseSection from './components/art/ShowcaseSection'
import GallerySection from './components/art/GallerySection'
import StatementSection from './components/art/StatementSection'
import Separator from './components/art/Separator'
import Navbar from "./components/Navbar";
import SmoothFollower from "./components/Cursor";

gsap.registerPlugin(ScrollTrigger)

const ArtPage = () => {
    const sectionsRef = useRef([])

    useEffect(() => {
        sectionsRef.current.forEach((el) => {
            gsap.fromTo(
                el,
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                }
            )
        })
    }, [])

    return (
        <div className="bg-[#0e0e0e] text-white overflow-hidden max-w-full">
            <SmoothFollower />
            <Navbar />
            <HeroSection />
            <div ref={(el) => (sectionsRef.current[0] = el)}>
                <ShowcaseSection />
            </div>
            <Separator />
            <div ref={(el) => (sectionsRef.current[1] = el)}>
                <GallerySection />
            </div>
            <Separator />
            <div ref={(el) => (sectionsRef.current[2] = el)}>
                <StatementSection />
            </div>
        </div>
    )
}

const rootElement = document.getElementById('artPage');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<ArtPage />);
} else {
    console.error("No element with id 'artPage' found.");
}
