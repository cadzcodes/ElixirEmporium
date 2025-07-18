import React, { useState } from 'react'
import ReactDOM from 'react-dom/client';
import Navbar from "./components/Navbar";
import SearchBar from "./components/cocktails/SearchBar";
import CocktailGrid from "./components/cocktails/CocktailGrid";
import SmoothFollower from "./components/Cursor";

const Commerce = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            <SmoothFollower />
            <Navbar />
            <div className="pt-24 px-4 md:px-12">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <CocktailGrid searchTerm={searchTerm} />
            </div>
        </div>
    )
}

const rootElement = document.getElementById('commerce');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<Commerce />);
} else {
    console.error("No element with id 'commerce' found.");
}
