import React from 'react';
import { ScrollTrigger, SplitText } from 'gsap/all';
import ReactDOM from 'react-dom/client';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Cocktails from './components/Cocktails';
import About from './components/About';
import Art from './components/Art';
import Menu from "./components/Menu";
import Contact from "./components/Contact";
import AboutPage from "./components/about/AboutPage";
import Section from "./components/about/Section";
import SmoothFollower from "./components/Cursor";

const AboutCompile = () => {
    return (
        <main>
            <SmoothFollower />
            <Navbar/>
            <AboutPage />
            <About />
        </main>
    )

};

const rootElement = document.getElementById('aboutCompile');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<AboutCompile />);
} else {
    console.error("No element with id 'About Compile' found.");
}
