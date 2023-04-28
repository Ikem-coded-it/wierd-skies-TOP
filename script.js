"use strict";
// c8771c06f7cc48b0828190952232704

class UIControls {
    currentDisplay = document.querySelector('#current-display');
    forecastDisplays = document.querySelectorAll('#display');

    async populatePage(data) {
        // POPULATE CURRENT WEATHER DISPLAY
        const location = document.getElementsByClassName('default-location')[0]
        const currentTemp = document.getElementById('current-temp');
        const currentIcon = document.getElementsByClassName('current-icon')[0];
        const currentCondition = document.getElementsByClassName('current-condition')[0];
        const feelsLike = document.getElementsByClassName('feels-like-display')[0]
        const visibility = document.getElementsByClassName('visibility-km-display')[0]
        const wind = document.getElementsByClassName('wind-display')[0]
        const humidity = document.getElementsByClassName('humidity-display')[0]

        location.innerText = `${data.location.name}, ${data.location.country}`;
        currentTemp.innerText = data.current.temp_c;
        currentIcon.src = data.current.condition.icon;
        currentCondition.innerText = data.current.condition.text;
        feelsLike.innerText = data.current.feelslike_c;
        visibility.innerText = data.current.vis_km + 'km';
        wind.innerText = data.current.wind_kph + 'kph';
        humidity.innerText = data.current.humidity;

        // POPULATE WEATHER FORECAST DISPLAYS
        const forecastWeatherData = data.forecast.forecastday;
        forecastWeatherData.shift() // remove current day from forecast
        const forecastDisplays = document.querySelector('#forecast').children;
        const forecastDisplaysArr = Array.from(forecastDisplays);
        
        forecastWeatherData.forEach(day => {
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
            forecastMaxTemp.innerText = 'Max: ' + day.day.maxtemp_c + '°C';
            forecastMinTemp.innerText = 'Min: ' + day.day.mintemp_c + '°C';
        })
    }
}

async function getWeather(location) {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=c8771c06f7cc48b0828190952232704&q=${location}&days=8`, {
        mode: 'cors',
    })

    const jsonResponse = await response.json()
    return jsonResponse;
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
        const weatherData = await getWeather(location);
        console.log(weatherData);
    })
}

async function initialize() {
    const uiControls = new UIControls()
    const defaultWeatherData = await defaultLocationWeather()
    uiControls.populatePage(defaultWeatherData)
}

initialize()