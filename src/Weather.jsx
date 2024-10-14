import React, { useState, useEffect, useRef } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

export default function Weather() {

    const [weather, setWeather] = useState(null)
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

    const ipinfoToken = "695163bec190eb";
    const WEATHER_API_KEY = "214bfc6b7dcc473b2da0bc13acc15556";
    
    const date = new Date();
    const day = date.getDate();
    let month = date.getMonth();
    switch (month) {
        case 0:
            month = "January";
            break;
        case 1:
            month = "February";
            break;
        case 2:
            month = "March";
            break;
        case 3:
            month = "April";
            break;
        case 4:
            month = "May";
            break;
        case 5:
            month = "June";
            break;
        case 6:
            month = "July";
            break;
        case 7:
            month = "August";
            break;
        case 8:
            month = "September";
            break;
        case 9:
            month = "October";
            break;
        case 10:
            month = "November";
            break;
        case 11:    
            month = "December";
            break;
    }
    let dayName = date.getDay();
    switch (dayName) {
        case 0:
            dayName = "Sunday";
            break;
        case 1:
            dayName = "Monday";
            break;
        case 2:
            dayName = "Tuesday";
            break;
        case 3:
            dayName = "Wednesday";
            break;
        case 4:
            dayName = "Thursday";
            break;
        case 5:
            dayName = "Friday";
            break;
        case 6:
            dayName = "Saturday";
            break;
    }

    const dateTimeFormat = `${dayName} ${day} ${month}`;

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
            setWeather(data);
            setIsPending(false);
            if(data.list[0].main.temp > 0){
                setPlusOrMinus("+" + data.list[0].main.temp + "°C") 
            }else {
                setPlusOrMinus("-" + data.list[0].main.temp + "°C")
            }
            console.log(data)
            setInvalidCityName(null);
            setError(null);

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
        setCity(citySearchRef.current);
        getWeather(citySearchRef.current);
        document.getElementById("searchInput").value = "";
    }
    

    return (
        <>
            {location && <nav>
                            <div><img className="logo" src="src\assets\WEATHERLY-removebg.png" alt="LOGO" /></div>
                            <div className="locationDiv">
                                <FontAwesomeIcon icon={faLocationDot} />
                                <span className="ms-1 locationText">Current Location: </span>
                                <span className="text-decoration-underline">{city}</span>
                            </div>
                            <div className="searchDiv">
                                <input type="text" placeholder="Type a City Name" 
                                    className="cityInput" id="searchInput" onChange={handleInput}/>
                                <button className="searchBtn" onClick={changeCity}>Search</button>
                            </div>
                            <div><span className="dateTime">{dateFormat}</span></div>
                        </nav>}
            {invalidCityName && <div className="alertDiv"><div className="alert alert-danger" role="alert">{invalidCityName}</div></div>}
            {isPending && <div className="pendingDiv text-primary">
                            <span className="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
                            <span role="status">Loading...</span>
                        </div>}
            {error && <div className="errorDiv text-danger fs-3"><span className="text-center">{error}</span></div>}
            {(weather && <div key={weather.city.id} className="weatherDiv">
                            <div className="mainWeatherDiv">
                                <div className="mainWeather">
                                    <img src={`https://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}@2x.png`} alt="weather icon" />
                                    <p className="sunTime">sunrise: {sunriseFormat}</p>
                                    <p className="sunTime">sunset: {sunsetFormat}</p>
                                </div>
                                <div className="detailWeather">
                                    <h3>{dateTimeFormat}</h3>
                                    <p className="fs-1 text-warning mb-0">{plusOrMinus}</p>
                                    <p className="fs-5 mb-0">Feels like {weather.list[0].main.feels_like} °</p>
                                    <p className="mb-0">{weather.list[0].weather[0].main}</p>
                                </div>
                                <div className="moreDetail">
                                    <h5 className="mb-4">MORE DETAILS:</h5>
                                    <p className="mb-2">Wind Speed: {weather.list[0].wind.speed} m/s</p>
                                    <p className="mb-2">Air Humidity: {weather.list[0].main.humidity} %</p>
                                    <p className="mb-2">Pressure: {weather.list[0].main.pressure} hPa</p>
                                    <p className="mb-0">Precipitation Probability: {weather.list[0].pop * 100} %</p>
                                </div>
                            </div>
                            <div className="cardContainer">
                                <p className="fiveDayForecastTitle"><span>5 Day Forecast</span></p>
                                        {fiveDayData && fiveDayData.map((element, index) => (
                                            <div className="card" key={index}>
                                                <div className="card-body">
                                                    <h4 className="date">{element.dt_txt.substring(0, 10)}</h4>
                                                    <p><span>Temperature: </span><span>{element.main.temp}°C</span></p>
                                                    <p><span>Wind Speed: </span><span>{element.wind.speed} m/s</span></p>
                                                    <p style={{marginBottom: "0"}}><span>Humidity: </span><span>{element.main.humidity}%</span></p>
                                                    <img src={`https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png`} alt="weather icon" />
                                                    <p><span>{element.weather[0].description}</span></p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
            )}
        </>
    ) 
}