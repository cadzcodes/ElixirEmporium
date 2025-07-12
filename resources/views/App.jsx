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

const App = () => {
    return (
        <main>
            <Navbar/>
            <Hero />
            <Cocktails />
            <About />
            <Art />
            <Menu />
            <Contact />
        </main>
    )

};

const rootElement = document.getElementById('app');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<App />);
} else {
    console.error("No element with id 'app' found.");
}
