import React from 'react';
import { Link } from 'react-router-dom';

const CountryList = ({ countries }) => {
  return (
    <div>
      <h2>Results:</h2>
      <ul>
        {countries.map((country) => (
          <li key={country.cca3}>
            {country.name.common}
            <Link to={`/country/${country.cca3}`}>
              <button>View Details</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountryList;
