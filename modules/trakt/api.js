const axios = require('axios');
require('dotenv').config();

const trakt = "https://api.trakt.tv"; // Base URL for any Trakt API requests
const openWeatherMapBaseUrl = "http://api.openweathermap.org/data/2.5";
const foursquareBaseUrl = "https://api.foursquare.com/v2";

// Trakt API function
async function getMostWatchedShows() {
  let reqUrl = `${trakt}/shows/watched?extended=full&page=1&limit=15`;
  let response = await fetch(
    reqUrl,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": 2,
        "trakt-api-key": process.env.TRAKT_CLIENT_ID
      }
    }
  );
  return await response.json(); // Return the JSON data from the response
}

// OpenWeatherMap API function
async function getWeather(location) {
  const response = await axios.get(`${openWeatherMapBaseUrl}/weather`, {
    params: {
      q: location,
      appid: process.env.OPENWEATHERMAP_API_KEY,
      units: 'metric'
    }
  });
  return response.data;
}

// Foursquare API function
async function getTouristPlaces(location, placeType) {
  const response = await axios.get(`${foursquareBaseUrl}/venues/explore`, {
    params: {
      near: location,
      section: placeType,
      client_id: process.env.FOURSQUARE_API_KEY,
      client_secret: process.env.FOURSQUARE_CLIENT_SECRET,
      v: '20210731'
    }
  });
  return response.data.response.groups[0].items;
}

// Export functions
module.exports = {
  getMostWatchedShows,
  getWeather,
  getTouristPlaces
};
