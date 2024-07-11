const apiKey = '7425eb8134253dc717db0b1360f3f0b7';
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const forecastWeather = document.getElementById('5day-forecast');

let cities = JSON.parse(localStorage.getItem('cities')) || [];

function fetchWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayCurrentWeather(data);
            displayForecast(data);
            saveCity(city);
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });
}

function displayCurrentWeather(data) {
    currentWeather.innerHTML = '';
    const weather = data.list[0];
    const city = data.city.name;
    const date = new Date(weather.dt * 1000).toLocaleDateString();
    const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;

    const weatherCard = `
        <div class="weather-card">
            <h2>${city} (${date}) <img src="${iconUrl}" alt="${weather.weather[0].description}"></h2>
            <p>Temperature: ${weather.main.temp} °C</p>
            <p>Humidity: ${weather.main.humidity} %</p>
            <p>Wind Speed: ${weather.wind.speed} m/s</p>
        </div>
    `;
    currentWeather.innerHTML = weatherCard;
}

function displayForecast(data) {
    forecastWeather.innerHTML = '';
    const forecasts = data.list.filter(entry => entry.dt_txt.includes('12:00:00'));
    
    forecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

        const forecastCard = `
            <div class="weather-card">
                <h3>${date} <img src="${iconUrl}" alt="${forecast.weather[0].description}"></h3>
                <p>Temperature: ${forecast.main.temp} °C</p>
                <p>Humidity: ${forecast.main.humidity} %</p>
                <p>Wind Speed: ${forecast.wind.speed} m/s</p>
            </div>
        `;
        forecastWeather.innerHTML += forecastCard;
    });
}

function saveCity(city) {
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem('cities', JSON.stringify(cities));
        renderSearchHistory();
    }
}

function renderSearchHistory() {
    searchHistory.innerHTML = '';
    cities.forEach(city => {
        const button = document.createElement('button');
        button.classList.add('city-button');
        button.textContent = city;
        button.addEventListener('click', () => {
            fetchWeather(city);
        });
        searchHistory.appendChild(button);
    });
}

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        fetchWeather(searchTerm);
        searchInput.value = '';
    }
});

renderSearchHistory();
