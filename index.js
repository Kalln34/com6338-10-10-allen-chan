const countryInput = document.getElementById('countryInput');
const countryResult = document.getElementById('countryResult');
const countryDetails = document.getElementById('countryDetails');
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
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) {
            throw new Error('Country not found');
        }
        
        const data = await response.json();
        displayCountryInfo(data[0]);
        
        countryResult.classList.remove('hidden');

    } catch (error) {
        alert(`Error: ${error.message}`);
        countryResult.classList.add('hidden');
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
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Languages:</strong> ${languages}</p>
            </div>
            <a href="activities.html?country=${encodeURIComponent(country.name.common)}" class="btn">
                Explore Activities
            </a>
        </div>
    `;
    
    countryResult.scrollIntoView({ behavior: 'smooth' });
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