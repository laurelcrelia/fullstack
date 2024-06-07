import axios from "axios";
const api_key = import.meta.env.VITE_WEATHER_API_KEY;
const baseUrl = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=`;

const getCountryWeather = (countryName) => {
  return axios.get(`${baseUrl}${countryName}`);
};

export default {
  getCountryWeather,
};
