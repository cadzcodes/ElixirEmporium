import React from 'react';
import { ScrollTrigger, SplitText } from 'gsap/all';
import ReactDOM from 'react-dom/client';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

const App = () => {
    return (
        <main>
            <Navbar/>
            <Hero />
            <div className="h-dvh bg-black"></div>
        </main>
    )

};

const rootElement = document.getElementById('app');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<App />);
} else {
    console.error("No element with id 'app' found.");
}
