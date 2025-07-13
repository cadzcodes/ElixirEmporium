// SearchBar.jsx
import React from 'react'
import { FiSearch } from 'react-icons/fi'

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full shadow-lg px-4 py-2 transition-all focus-within:ring-2 ring-cyan-400">
        <FiSearch className="text-gray-300 text-xl mr-3" />
        <input
          type="text"
          placeholder="Search for a cocktail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent outline-none text-white flex-1 placeholder-gray-400"
        />
      </div>
    </div>
  )
}

export default SearchBar
