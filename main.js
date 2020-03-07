// select element
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

// declare  variable
const weather = {};

weather.temperature = {
    unit: "celsius"
}

const KELVIN = 273;

// API KEY ****check weather map for API****
const key = "853b5d2ce3bb8180f0b86df75c062cd5"

// check if browser supports geolocation
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError)
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser dosen't support Geolocation</p>"
}

// set user location
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude)
}

function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`
}

// get weather from api provider
function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then(function(response) {
        let data = response.json();
        console.log(data)
        return data
    }).then(function (data) {
        weather.temperature.value = Math.floor(data.main.temp - KELVIN);
        weather.description = data.weather[0].description;
        weather.iconId = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
    })
    .then(function () {
        displayWeather();
    })
}

// display weather
function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png">`;
    tempElement.innerHTML = `${weather.temperature.value}<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.country}, ${weather.city}`;
}

// c to fahrenheit
function celsiusToFahrenheit(temperature) {
    return (temperature * 9) / 5 + 32;
}

// when the user click on the temperature element
tempElement.addEventListener("click", function () {
    if (weather.temperature.value === undefined) return;
    if (weather.temperature.unit == "celsius") {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}&deg;<span>F</span>`;
        weather.temperature.unit = fahrenheit;
    } else {
        tempElement.innerHTML = `${weather.temperature.value}&deg;<span>C</span>`;
        weather.temperature.unit = "celsius";
    }
});