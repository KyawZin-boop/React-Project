

export default function Weather({weatherData, isPending, error, sunriseFormat, sunsetFormat, plusOrMinus, fiveDayData, invalidCityName}) {
 
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


    return (
        <>
            {invalidCityName && <div className="alertDiv">
                                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                        {invalidCityName}
                                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>
                                </div>}
            {isPending && <div className="pendingDiv text-primary">
                            <span className="loader" aria-hidden="true"></span>
                        </div>}
            {error && <div className="errorDiv text-danger fs-3"><span className="text-center">{error}</span></div>}
            {(weatherData && <div key={weatherData.city.id} className="weatherDiv">
                            <div className="mainWeatherDiv">
                                <div className="mainWeather">
                                    <img src={`https://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}@2x.png`} alt="weather icon" />
                                    <p className="sunTime">sunrise: {sunriseFormat}</p>
                                    <p className="sunTime">sunset: {sunsetFormat}</p>
                                </div>
                                <div className="detailWeather">
                                    <h3>{dateTimeFormat}</h3>
                                    <p className="fs-1 text-warning mb-0">{plusOrMinus}</p>
                                    <p className="fs-5 mb-0">Feels like {weatherData.list[0].main.feels_like} °</p>
                                    <p className="mb-0">{weatherData.list[0].weather[0].main}</p>
                                </div>
                                <div className="moreDetail">
                                    <h5 className="mb-4">MORE DETAILS:</h5>
                                    <p className="mb-2">Wind Speed: {weatherData.list[0].wind.speed} m/s</p>
                                    <p className="mb-2">Air Humidity: {weatherData.list[0].main.humidity} %</p>
                                    <p className="mb-2">Pressure: {weatherData.list[0].main.pressure} hPa</p>
                                    <p className="mb-0">Precipitation Probability: {weatherData.list[0].pop * 100} %</p>
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
                                                    <p className="mb-0"><span>Humidity: </span><span>{element.main.humidity}%</span></p>
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