"use strict";
// c8771c06f7cc48b0828190952232704

class UIControls {

    async populatePage(data, tempType) {
        // POPULATE CURRENT WEATHER DISPLAY
        let currentTempValue;
        let feelsLikeValue;

        // get celcius or farenheit from api data and assign to variables
        if (tempType == 'celcius') {
            currentTempValue = data.current.temp_c+'°C';
            feelsLikeValue = 'Feels like: '+data.current.feelslike_c+'°C'
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

        changeBackground(data.current.condition.text);
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

    populateFooter() {
        console.log('here')
        const footer = document.getElementsByTagName('footer')[0];
        console.log(footer)
        footer.innerHTML = `Ikem-coded-it ${new Date().getFullYear()} <a href='https://github.com/ikem-coded-it'><i class="fa-brands fa-github"></i></a>`;
        return;
    }
}
const uiControls = new UIControls()

async function getWeather(location) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=c8771c06f7cc48b0828190952232704&q=${location}&days=8`, {
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

function changeBackground(condition) {
    const body = document.getElementsByTagName('body')[0];
    if (window.innerWidth > 600) {
        if (condition == 'Cloudy' || condition == 'Partly cloudy' || condition == 'Overcast') {
            body.style.background = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),url(./desktop-images/desktop-wallpaper-res-1920x1080-new-anime-scenery-gallery-beautiful-cloudy-sky-anime.jpg)"
        } else if (condition == 'Sunny') {
            body.style.background = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),url(./desktop-images/desktop-wallpaper-anime-one-piece-thousand-sunny-one-piece-ship.jpg)"
        } else if (condition == 'Clear') {
            body.style.background = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),url(./desktop-images/7ee273a18589fea7f01a9a5fac0af817.jpg)"
        } else if (condition == 'Patchy rain' || condition == 'Light rain' || condition == 'Moderate rain' || condition == 'Patchy rain possible' || condition == 'Light rain shower') {
            body.style.background = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),url(./desktop-images/desktop-wallpaper-anime-girls-on-boat-rain-original.jpg)"
        } else if (condition == 'Heavy rain') {
            body.style.background = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),url(./desktop-images/desktop-wallpaper-itachi-and-kisame-naruto-anime-itachi-rain.jpg)"
        } else {
            body.style.backgroundImage = "";
            body.style.backgroundColor = "#1e293b"
        }
    } else {
        if (condition == 'Partly cloudy') {
            body.style.background = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),url(./mobile-images/7836c9a700783439f5396c8ce99b64fb.jpg)"
        } else if (condition == 'Cloudy') {
            body.style.background = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),url(./mobile-images/5ce247339962eba8b28a718c53ccd885.jpg)"
        } else if (condition == 'Overcast') {
            body.style.background = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),url(./mobile-images/desktop-wallpaper--thumbnail.jpg)"
        } else if (condition == 'Sunny') {
            body.style.background = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),url(./mobile-images/c153486fc0be00cb9c421149967d08e4.jpg)"
        } else if (condition == 'Clear') {
            body.style.background = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),url(./mobile-images/6529f13ead31327992dc46a276a3b84b.jpg)"
        } else if (condition == 'Patchy rain' || condition == 'Patchy rain possible') {
            body.style.background = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),url(./mobile-images/desktop-wallpaper-sad-kakashi-kakashihatake-rain-art-fictional-character-hatake-anbu-naruto-sharingan-akatsuki-rin-manga-obito-anime.jpg)"
        } else if (condition == 'Light rain' || condition == 'Moderate rain' || condition == 'Light rain shower') {
            body.style.background = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),url(./mobile-images/086f1d40a3b16f48b7c0357aae552d2e.jpg)"
        } else if (condition == 'Heavy rain') {
            body.style.background = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),url(./mobile-images/desktop-wallpaper-anime-rain-atmosphere-sky-anime-girl-thumbnail.jpg)"
        } else {
            body.style.backgroundImage = "";
            body.style.backgroundColor = "#1e293b"
        }
    }
    body.style.backgroundSize = "cover";
    body.style.backgroundRepeat = "no-repeat";
    body.style.backgroundPosition = "center";
    body.style.transition = "background 500ms ease-in-out";
}

async function initialize() {
    const defaultWeatherData = await defaultLocationWeather()
    uiControls.populatePage(defaultWeatherData, 'celcius')
    searchLocationWeather()
    uiControls.temperatureSwitch()
    uiControls.populateFooter()
}

initialize()