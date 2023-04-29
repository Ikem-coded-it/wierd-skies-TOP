"use strict";
// c8771c06f7cc48b0828190952232704

class UIControls {

    async populatePage(data, tempType) {
        // POPULATE CURRENT WEATHER DISPLAY
        let currentTempValue
        let feelsLikeValue

        // get celcius or farenheit from api data and assign to variables
        if (tempType == 'celcius') {
            currentTempValue = data.current.temp_c+'°C';
            feelsLikeValue = 'Feels like: '+data.current.feelslike_c+'°F'
        } else if (tempType == 'fahrenheit') {
            currentTempValue = data.current.temp_f+'°F';
            feelsLikeValue = 'Feels like: '+data.current.feelslike_f+'°F'
        }


        const location = document.getElementsByClassName('default-location')[0]
        const currentTemp = document.getElementById('current-temp');
        const currentIcon = document.getElementsByClassName('current-icon')[0];
        const currentCondition = document.getElementsByClassName('current-condition')[0];
        const feelsLike = document.getElementsByClassName('feels-like-display')[0]
        const visibility = document.getElementsByClassName('visibility-km-display')[0]
        const wind = document.getElementsByClassName('wind-display')[0]
        const humidity = document.getElementsByClassName('humidity-display')[0]

        location.innerText = `${data.location.name}, ${data.location.country}`;
        currentTemp.innerText = currentTempValue;
        currentIcon.src = data.current.condition.icon;
        currentCondition.innerText = data.current.condition.text;
        feelsLike.innerText = feelsLikeValue;
        visibility.innerText = 'Visibility: '+data.current.vis_km + 'km';
        wind.innerText = 'Wind: '+data.current.wind_kph + 'kph';
        humidity.innerText = 'Humidity: '+data.current.humidity;

        // POPULATE WEATHER FORECAST DISPLAYS
        const forecastWeatherData = data.forecast.forecastday;
        forecastWeatherData.shift() // remove current day from forecast
        const forecastDisplays = document.querySelector('#forecast').children;
        const forecastDisplaysArr = Array.from(forecastDisplays);
        
        forecastWeatherData.forEach(day => {
            let maxTempValue;
            let minTempValue;

            if (tempType == 'celcius') {
                maxTempValue = 'Max: ' + day.day.maxtemp_c + '°C';
                minTempValue = 'Min: ' + day.day.mintemp_c + '°C';
            } else if (tempType == 'fahrenheit') {
                maxTempValue = 'Max: ' + day.day.maxtemp_f + '°F';
                minTempValue = 'Min: ' + day.day.mintemp_f + '°F';
            }

            const dayIndex = forecastWeatherData.indexOf(day);
            const dayDisplay = forecastDisplaysArr[dayIndex]
            
            const forecastDate = dayDisplay.children[0];
            const forecastCondition = dayDisplay.children[1].children[0];
            const forecastIcon = dayDisplay.children[1].children[1];
            const forecastMaxTemp = dayDisplay.children[2];
            const forecastMinTemp = dayDisplay.children[3];

            forecastDate.innerText = day.date;
            forecastCondition.innerText = day.day.condition.text;
            forecastIcon.src = day.day.condition.icon;
            forecastMaxTemp.innerText = maxTempValue;
            forecastMinTemp.innerText = minTempValue;
        })
    }

    temperatureSwitch() {
        const toggle = document.getElementsByClassName('toggle')[0];
        const switchBtn = document.getElementsByClassName('swittch')[0];

        toggle.addEventListener('click', (e) => {
            e.target.classList.toggle('farenheit')
            if (e.target.classList.length > 1) { // would have more than one class if 'fahrenheit' is toggled
                showFahrenheit()
            } else {
                showCelcius()
            }
        })
    }
}
const uiControls = new UIControls()

async function getWeather(location) {
    try {
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=c8771c06f7cc48b0828190952232704&q=${location}&days=8`, {
            mode: 'cors',
        })

        const jsonResponse = await response.json()
        return jsonResponse;
    } catch (error) {
        console.log(error)
    }
}

async function defaultLocationWeather() {
    const weatherData = await getWeather('enugu');
    return weatherData;
}

function searchLocationWeather() {
    const form = document.querySelector('form')
    form.addEventListener('submit', async(e) => {
        e.preventDefault()
        const location = e.target.location.value;
        const customLocationWeatherData = await getWeather(location);
        uiControls.populatePage(customLocationWeatherData, 'celcius')
    })
}

async function showFahrenheit() {
    const locationDisplay = document.getElementsByClassName('default-location')[0];
    const weatherData = await getWeather(locationDisplay.innerText);
    uiControls.populatePage(weatherData, 'fahrenheit')
    return
}

async function showCelcius() {
    const locationDisplay = document.getElementsByClassName('default-location')[0];
    const weatherData = await getWeather(locationDisplay.innerText);
    uiControls.populatePage(weatherData, 'celcius')
    return
}

async function initialize() {
    const defaultWeatherData = await defaultLocationWeather()
    uiControls.populatePage(defaultWeatherData, 'celcius')
    searchLocationWeather()
    uiControls.temperatureSwitch()
}

initialize()