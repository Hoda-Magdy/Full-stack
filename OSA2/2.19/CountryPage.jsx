import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CountryPage = () => {
  const { cca3 } = useParams(); // Retrieve the country code from the URL
  const [country, setCountry] = useState(null);

  useEffect(() => {
    // Use /api/alpha/{cca3} for country details
    fetch(`https://studies.cs.helsinki.fi/restcountries/api/v1/alpha/${cca3}`)
      .then((response) => response.json())
      .then((data) => setCountry(data))
      .catch((error) => console.error('Error fetching country data:', error));
  }, [cca3]);

  if (!country) {
    return <p>Loading...</p>;
  }

  const flagUrl = country.flags && country.flags[0] ? country.flags[0] : null;

  return (
    <div>
      <h2>{country.name.common}</h2>
      {flagUrl && <img src={flagUrl} alt={country.name.common} style={{ width: '150px' }} />}
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      {/* Add more country information as needed */}
    </div>
  );
};

export default CountryPage;
