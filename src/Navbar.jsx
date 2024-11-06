import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

function Navbar({city, changeCity, handleInput, dateFormat, location}) {
    return (<>{location && <nav>
                                <div><img className="logo" src="/images/logo.png" alt="Weatherly Logo" /></div>
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
    </>
    );
}

export default Navbar

