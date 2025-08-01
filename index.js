const countryInput = document.getElementById('countryInput');
const countryResult = document.getElementById('countryResult');
const countryDetails = document.getElementById('countryDetails');
const weatherInfo = document.getElementById('weatherInfo');
const weatherDetails = document.getElementById('weatherDetails');
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
});
    
document.querySelectorAll('.nav-btn').forEach(link => {
    link.addEventListener('click',() => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
    });
});

async function getCountryInfo() {
    const countryName = countryInput.value.trim();
    if (!countryName) {
        alert('Please enter a country name');
        return
    }

    try {
        const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!countryResponse.ok) {
            throw new Error('Country not found');
        }
        const countryData = await countryResponse.json();
        const country = countryData[0];
        displayCountryInfo(country);
        if (country.capital && country.capital[0]) {
          await getCapitalWeather(country.capital[0], country.name.common);
        } else {
            weatherInfo.classList.add('hidden');
        }

        countryResult.classList.remove('hidden');
    } catch (error) {
        alert(`Error: ${error.message}`);
        countryResult.classList.add('hidden');
        weatherInfo.classList.add('hidden');
    }
}

async function getCapitalWeather(capital, countryName) {
    try {
        const apiKey = '346eae349864fcea3c5ac35c5d05c789';
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${capital},${countryName}&units=metric&appid=${apiKey}`
        );
        if (!weatherResponse.ok) {
            throw new Error('Weather data not available');
        }
        const weatherData = await weatherResponse.json();
        displayWeatherInfo(weatherData, countryName, capital);
        weatherInfo.classList.remove('hidden');
    } catch (error) {
        console.error('Weather fetch error:', error);
        weatherDetails.innerHTML = `
            <div class="weather-card">
                <h4>Weather in ${capital} (Capital of ${countryName})</h4>
                <p>Weather information not available</p>
                <a href="activities.html?country=${encodeURIComponent(countryName)}" class="btn explore-btn">
                    Explore Activities
                </a>
            </div>
        `;
        weatherInfo.classList.remove('hidden');
    }
}

function displayCountryInfo(country) {
    const capital = country.capital ? country.capital[0] : 'N/A';
    const population = country.population.toLocaleString();
    let currencies = 'N/A';
    if (country.currencies) {
        currencies = Object.values(country.currencies)
            .map(currency => currency.name)
            .join(', ');
    }
    let languages = 'N/A';
    if (country.languages) {
        languages = Object.values(country.languages).join(', ');
    }
    countryDetails.innerHTML = `
        <div class="country-info">
            <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
            <h3>${country.name.common}</h3>
            <div class="details-grid">
                <p><strong>Capital:</strong> ${capital}</p>
                <p><strong>Population:</strong> ${population}</p>
                <p><strong>Languages:</strong> ${languages}</p>
                <p><strong>Currencies:</strong> ${currencies}</p>
            </div>
        </div>
    `;
    countryResult.scrollIntoView({ behavior: 'smooth' });
}

function displayWeatherInfo(weatherData, countryName, capital) {
    const temp = Math.round(weatherData.main.temp);
    const feelsLike = Math.round(weatherData.main.feels_like);
    const description = weatherData.weather[0].description;
    const icon = weatherData.weather[0].icon;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;

    weatherDetails.innerHTML = `
        <div class="weather-card">
            <h4>Weather in ${capital} (Capital of ${countryName})</h4>
            <div class="weather-main">
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
                <div>
                    <p class="weather-temp">${temp}°C</p>
                    <p class="weather-desc">${description}</p>
                    <p>Feels like: ${feelsLike}°C</p>
                </div>
            </div>
            <div class="weather-details">
                <p><strong>Humidity:</strong> ${humidity}%</p>
                <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
            </div>
             <a href="activities.html?country=${encodeURIComponent(countryName)}" class="btn">
                Explore Activities
            </a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    countryInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') getCountryInfo();
    });

    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', getCountryInfo);

    countryInput.focus();
});