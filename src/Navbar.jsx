import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";

function Navbar({city, changeCity, handleInput, dateFormat, location}) {

    const [ cityList, setCityList ] = useState([]);

    const fetchCityList = async () => {
        const response = await fetch ('/world-cities-data.json')
        const data = await response.json()
        setCityList(data);
    };
    
    useEffect(() => {
        fetchCityList();
    }, []);

    const cityOptions = cityList.map(city => ({
        value: city.name,
        label: `${city.name}, ${city.country}`
    }));

    // Handle city selection
    const handleCitySelect = (selectedOption) => {
        if (selectedOption) {
            changeCity(selectedOption.value);
        }
    };

    return (<>{location && <nav>
                                <div><img className="logo" src="/images/logo.png" alt="Weatherly Logo" /></div>
                                <div className="locationDiv">
                                    <FontAwesomeIcon icon={faLocationDot} />
                                    {/* <Select
                                        options={cityOptions}
                                        onChange={handleCitySelect}
                                        placeholder="Search for a city..."
                                        isClearable
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                color: 'red',
                                                minWidth: 240,
                                                maxWidth: 350,
                                            })
                                        }}
                                    /> */}
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
    </>
    );
}

export default Navbar

