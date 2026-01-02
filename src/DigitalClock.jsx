import { useState, useEffect } from "react";
import "./DigitalClock.css"

function DigitalClock()
{   
    const [time, setTime ] = useState(new Date());

    const [temp, setTemp] = useState("--");

    useEffect(() => {
        const intervlID = setInterval(()=>{
            setTime(new Date());
        }, 10);

        return () =>{
            clearInterval(intervlID);
        }

    }, []);

    // temperature data fetching according to the geolocation
    useEffect(() => {
        const DEFAULT_LAT = 16.8409;
        const DEFAULT_LONG = 96.1735;

        const fetchWeather = async (lat, long) => {
            try{
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m`;
                const response = await fetch(url);
                const data = await response.json();

                setTemp(Math.round(data.current.temperature_2m))
            }
            catch(error)
            {
                console.error("Weather fetch failed:", error);
            }
        };

        const initWeather = () => {
            if(navigator.geolocation)
            {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        fetchWeather(position.coords.latitude, position.coords.longitude)
                    },
                    (error) =>
                    {
                        console.warn(error, "Location access denied. Using default.");
                        fetchWeather(DEFAULT_LAT, DEFAULT_LONG);
                    }
                ) 
            }
            else{
                fetchWeather(DEFAULT_LAT, DEFAULT_LONG);
            }
        };

        initWeather();

        const weatherIntervalID = setInterval(initWeather, 900000); // refresh in every 15 minutes

        // clean up interval on unmount
        return () => {
            clearInterval(weatherIntervalID);
        }

    }, []);

    function padZero(number)
    {
        return (number < 10 ? "0" : "") + number;
        
    }

    let hoursRaw = time.getHours();
    const hours = padZero(hoursRaw % 12 || 12); // 12-hour format
    const minutes = padZero(time.getMinutes());
    const seconds = padZero(time.getSeconds());
    const milliseconds = padZero(Math.floor(time.getMilliseconds() / 10));
    const meridiem = hoursRaw >= 12 ? "PM" : "AM";

    // for days of week and Date system
    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    const dayName = daysOfWeek[time.getDay()]; 
    const dateNum = padZero(time.getDate());   
    const monthNum = padZero(time.getMonth() + 1); 
    const yearNum = time.getFullYear();

    // const temperature = 24;


    return(
        <div className="clock-container">
            <div className="clock">
                <div className="digit-box">{hours}</div>
                <div className="separator">:</div>
                <div className="digit-box">{minutes}</div>
                <div className="separator">:</div>
                <div className="digit-box">{seconds}</div>
                <div className="separator">:</div>
                <div className="digit-box">{milliseconds}</div>
            </div>

            <div className="icons">
                <div className="icon-box">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                </div>
                <div className="meridiem-wrapper">
                    <span className="day-icon">{meridiem}</span>
                </div>

                <div className="day-wrapper">
                    <span className="day-icon">{dayName}</span>
                </div>
                <div className="icon-box">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="13" r="8"></circle>
                        <path d="M12 21v-8"></path>
                        <path d="M12 13l3.5-3.5"></path>
                        <path d="M5 3 2 6"></path>
                        <path d="M22 6 19 3"></path>
                    </svg>
                </div>
            </div>

            <div className="date">
                <div className="data-group">
                    <div className="number">{dateNum}</div>
                    <div className="text">DATE</div>
                </div>

                <div className="data-group">
                    <div className="number">{monthNum}</div>
                    <div className="text">MONTH</div>
                </div>

                <div className="data-group">
                    <div className="number">{yearNum}</div>
                    <div className="text">YEAR</div>
                </div>

                <div className="data-group">
                    <div className="text">TEMP</div>
                    <div className="number">{temp}</div>
                    <div className="text">°C</div>
                </div>
            </div>
        </div>
    )
}

export default DigitalClock;