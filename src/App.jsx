import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar"
import Weather from "./Weather"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function App() {

  const [weatherData, setWeatherData] = useState(null)
  const [location, setLocation] = useState(null)
  const [isPending, setIsPending] = useState(true)
  const [city, setCity] = useState(null)
  const [dateFormat, setDateFormat] = useState(null)
  const [error, setError] = useState(null)
  const [invalidCityName, setInvalidCityName] = useState(null)
  const citySearchRef = useRef(null)
  const [sunriseFormat, setSunriseFormat] = useState(null)
  const [sunsetFormat, setSunsetFormat] = useState(null)
  const [plusOrMinus, setPlusOrMinus] = useState(null)
  const [fiveDayData, setFiveDayData] = useState([]);

  const ipinfoToken = import.meta.env.VITE_IPINFO_TOKEN;
  const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const getUserLocation = async () => {
    const response = await axios.get(`https://ipinfo.io/json?token=${ipinfoToken}`);
    const data = response.data;
    const [lat, lon] = data.loc.split(",");
    console.log(data);
    setLocation({
        city: data.city,
        lat: lat,
        lon: lon,
        country: data.country,
        region: data.region,
        timezone: data.timezone
    })
    setCity(data.city);
}

const getWeather = async (city) => {
    try{

        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);
        const data = await response.json();

        const timezoneOffset = data.city.timezone * 1000;
        const sunriseTimestamp = data.city.sunrise * 1000;
        const sunriseDate = new Date(sunriseTimestamp + timezoneOffset);
        const sunriseHour = sunriseDate.getUTCHours();
        const sunriseMinute = sunriseDate.getUTCMinutes();
        setSunriseFormat(`${sunriseHour.toString().padStart(2, '0')}:${sunriseMinute.toString().padStart(2, '0')}`);

        const sunsetTimestamp = data.city.sunset * 1000;
        const sunsetDate = new Date(sunsetTimestamp + timezoneOffset);
        const sunsetHour = sunsetDate.getUTCHours();
        const sunsetMinute = sunsetDate.getUTCMinutes();
        setSunsetFormat(`${sunsetHour.toString().padStart(2, '0')}:${sunsetMinute.toString().padStart(2, '0')}`);
        
        let array = [];
        array.push(data);
        console.log(array[0].list.filter(d => d.dt_txt.slice(11, 13) === "12"));
        setFiveDayData(array[0].list.filter(d => d.dt_txt.slice(11, 13) === "12"));
        setWeatherData(data);
        setIsPending(false);
        if(data.list[0].main.temp > 0){
            setPlusOrMinus("+" + data.list[0].main.temp + "°C") 
        }else {
            setPlusOrMinus("-" + data.list[0].main.temp + "°C")
        }
        console.log(data)
        setInvalidCityName(null);
        setError(null);
        setCity(citySearchRef.current??city);

    }catch(err){
        if(err.message === "Failed to fetch"){
            setWeather(null);
            setError(err.message + " the data! Pls check your connection and try again!");
        }else{
            setInvalidCityName("Pls check your city name and try again!");
        }
        console.log(err.message);
        setIsPending(false);
    }
}

useEffect(() => {
    const timerId = setInterval(() => {
        const date = new Date();
        setDateFormat(date.toLocaleString());
    }, 1000);

    return () => clearInterval(timerId);
}, [])

useEffect(() => {
    getUserLocation();
}, [])

useEffect(() => {
    if(location){
        getWeather(location.city);
    }
}, [location]);

const handleInput = (e) => {
    citySearchRef.current = e.target.value;
}

const changeCity = () => {
    getWeather(citySearchRef.current);
    document.getElementById("searchInput").value = "";
}

  return (
    <>
      <Navbar
        city={city}
        changeCity={changeCity}
        handleInput={handleInput}
        dateFormat={dateFormat}
        location={location}
      />
      <Weather 
        weatherData={weatherData}
        isPending={isPending}
        error={error}
        invalidCityName={invalidCityName}
        sunriseFormat={sunriseFormat}
        sunsetFormat={sunsetFormat}
        plusOrMinus={plusOrMinus}
        fiveDayData={fiveDayData}
      />
    </>
  )
}

export default App
