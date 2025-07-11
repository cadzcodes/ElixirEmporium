import React from 'react';
import { ScrollTrigger, SplitText } from 'gsap/all';
import ReactDOM from 'react-dom/client';

const App = () => {
    return (
        <div className="flex-center h-[100vh] ">
            <h1 className='text-3xl text-indigo-300'>Hello GSAP!</h1>
        </div>
    )

};

const rootElement = document.getElementById('app');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<App />);
} else {
    console.error("No element with id 'app' found.");
}
