import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CountryPage = () => {
  const { cca3 } = useParams();  // Retrieve the country code from the URL
  const [country, setCountry] = useState(null);
  const [weather, setWeather] = useState(null);  // Store weather data
  const [weatherError, setWeatherError] = useState(null); // For handling weather errors

  const apiKey = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your API key

  useEffect(() => {
    // Fetch country data by cca3 code
    fetch(`https://studies.cs.helsinki.fi/restcountries/api/v1/alpha/${cca3}`)
      .then((response) => response.json())
      .then((data) => {
        setCountry(data);
        
        if (data.capital && data.capital.length > 0) {
          // Fetch weather data for the capital city
          const capital = data.capital[0];
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`)  // Using metric for Celsius
            .then((response) => {
              if (!response.ok) {
                throw new Error('Failed to fetch weather data');
              }
              return response.json();
            })
            .then((weatherData) => {
              setWeather(weatherData);
            })
            .catch((error) => {
              setWeatherError(error.message);
            });
        }
      })
      .catch((error) => console.error('Error fetching country data:', error));
  }, [cca3, apiKey]);

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

      <h3>Weather in {country.capital && country.capital[0]}</h3>
      {weatherError && <p>Error fetching weather: {weatherError}</p>}
      {weather ? (
        <div>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Weather: {weather.weather[0].description}</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

export default CountryPage;
