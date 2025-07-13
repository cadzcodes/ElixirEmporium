import React from 'react'
import ReactDOM from 'react-dom/client';
import Navbar from "./components/Navbar";
import SearchBar from "./components/cocktails/SearchBar";
import CocktailGrid from "./components/cocktails/CocktailGrid";

const Commerce = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="pt-24 px-4 md:px-12">
                <SearchBar />
                <CocktailGrid />
            </div>
        </div>
    )
}

const rootElement = document.getElementById('commerce');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<Commerce />);
} else {
    console.error("No element with id 'app' found.");
}
