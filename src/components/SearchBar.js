import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <input
      className="search-bar"
      type="text"
      placeholder="Search Pokémon by name..."
      value={query}
      onChange={handleChange}
    />
  );
}

export default SearchBar; 