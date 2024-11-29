// import { height } from '@fortawesome/free-brands-svg-icons/fa42Group';
import React, { useEffect } from 'react';
import L from 'leaflet';

const Map = () => {
  useEffect(() => {
    // Initialize the map after the component mounts
    const map = L.map('map').setView([51.505, -0.09], 5);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add weather layer with OpenWeatherMap data
    const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const weatherLayer = L.tileLayer(
      `https://tile.openweathermap.org/map/temp/{z}/{x}/{y}.png?appid=${WEATHER_API_KEY}`,
      {
        maxZoom: 18,
        minZoom: 3,
        attribution: 'Weather data &copy; <a href="https://www.openweathermap.org/">OpenWeather</a> contributors',
      }
    );

    weatherLayer.addTo(map);

    // Cleanup the map instance when the component unmounts
    return () => {
      map.remove();
    };
  }, []); // Empty dependency array ensures this effect runs once after the first render

  return <div id="map" style={{  width: '100%' }}></div>;
};

export default Map;