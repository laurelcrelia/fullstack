import { useState, useEffect } from "react";
import weatherService from "../services/weather";

const CountryView = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    weatherService
      .getCountryWeather(country.capital)
      .then((data) => setWeather(data));
  }, [country.capital]);

  if (!weather) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h2>languages</h2>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.name.common} />
      <h2>Weather in {country.capital}</h2>
      <p>temperature: {weather.data.current.temp_c} Celsius</p>
      <img src={weather.data.current.condition.icon} alt="weather icon" />
      <p>wind: {(weather.data.current.wind_kph * 0.277778).toFixed(2)} m/s</p>
    </div>
  );
};

export default CountryView;
