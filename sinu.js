function connect() {
    var countryName = document.getElementById("countryInput").value.trim();
    document.getElementById("countryInput").value = "";

    if (countryName === "") {
        alert("Please enter a country name.");
        return;
    }

    var url = `https://restcountries.com/v3.1/name/${countryName}`;
    fetch(url)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Country not found');
            }
            return response.json();
        })
        .then(function(data) {
            process(data);
        })
        .catch(function(error) {
            alert(error.message);
        });
}

function process(data) {
    var countries = data;
    var resultsContainer = document.getElementById("countryResults");
    resultsContainer.innerHTML = "";

    countries.forEach(function(country) {
        var countryDiv = document.createElement("div");
        countryDiv.classList.add("country-info");

        countryDiv.innerHTML = `
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" class="img-fluid mb-3" style="width: 400px; height: auto;">
            <h3>${country.name.common}</h3>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Area:</strong> ${country.area.toLocaleString()} km²</p>
            <p><strong>Currency:</strong> ${Object.values(country.currencies || {}).map(c => c.name).join(', ')}</p>
            <p><strong>Languages:</strong> ${Object.values(country.languages || {}).join(', ')}</p>
            <button class="btn btn-primary mt-2" onclick="fetchWeather('${country.capital ? country.capital[0] : ''}', '${country.name.common}')">More Details</button>
            <div class="weather-details mt-3"></div>
        `;

        resultsContainer.appendChild(countryDiv);
    });
}

function fetchWeather(capital, countryName) {
    if (!capital) {
        alert('Weather data is not available for this country.');
        return;
    }

    var weatherApiKey = 'c400711abdb3212552421c1017ae7c76';
    var weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${weatherApiKey}`;

    fetch(weatherApiUrl)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Weather data not found');
            }
            return response.json();
        })
        .then(function(weatherData) {
            var countryDivs = document.querySelectorAll(".country-info");
            var countryDiv = Array.from(countryDivs).find(div => div.querySelector("h3").textContent === countryName);

            if (countryDiv) {
                var weatherDetails = countryDiv.querySelector(".weather-details");
                weatherDetails.innerHTML = `
                    <h6>Weather in ${capital}:</h6>
                    <p><strong>Temperature:</strong> ${(weatherData.main.temp - 273.15).toFixed(2)}°C</p>
                    <p><strong>Condition:</strong> ${weatherData.weather[0].description}</p>
                    <p><strong>Humidity:</strong> ${weatherData.main.humidity}%</p>
                    <p><strong>Wind Speed:</strong> ${(weatherData.wind.speed * 3.6).toFixed(2)} km/h</p>
                `;
                var weatherButton = countryDiv.querySelector("button");
                if (weatherButton) {
                    weatherButton.style.display = 'none';
                }
            }
        })
        .catch(function(error) {
            alert(error.message);
        });
}
