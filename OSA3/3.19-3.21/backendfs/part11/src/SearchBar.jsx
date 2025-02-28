import React from 'react';

const SearchBar = ({ setSearchQuery }) => {
  return (
    <div>
      <input
        type="text"
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a country..."
      />
    </div>
  );
};

export default SearchBar;
