import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import CountryList from './CountryList';
import CountryDetails from './CountryDetails';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      setLoading(true);
      fetch(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then((response) => response.json())
        .then((data) => {
          const filtered = data.filter((country) =>
            country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredCountries(filtered);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setFilteredCountries([]);
    }
  }, [searchQuery]);

  return (
    <div>
      <SearchBar setSearchQuery={setSearchQuery} />
      {loading ? <p>Loading...</p> : null}
      {filteredCountries.length > 10 && (
        <p>Too many countries found, please specify a more specific search.</p>
      )}
      {filteredCountries.length > 1 && filteredCountries.length <= 10 && (
        <CountryList countries={filteredCountries} />
      )}
      {filteredCountries.length === 1 && (
        <CountryDetails country={filteredCountries[0]} />
      )}
    </div>
  );
};

export default App;
