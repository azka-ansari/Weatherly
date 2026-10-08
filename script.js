
const API_KEY = "5a526575de3841bbbdc93240260810";



const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");


searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    getWeather(city);

});


cityInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        searchBtn.click();

    }

});


async function getWeather(city) {

    showLoading();

    hideError();


    try {

        const url =
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=5&aqi=no&alerts=no`;


        const response = await fetch(url);


        const data = await response.json();


        if (!response.ok || data.error) {

            throw new Error(
                data.error?.message || "Unable to get weather."
            );

        }


        updateCurrentWeather(data);

        updateForecast(data);


    } catch (error) {

        showError(error.message);

    } finally {

        hideLoading();

    }

}

function updateCurrentWeather(data) {

    const location = data.location;
    const current = data.current;


    document.getElementById("cityName").textContent =
        `${location.name}, ${location.country}`;


    document.getElementById("headerLocation").textContent =
        `${location.name}, ${location.country}`;


    document.getElementById("date").textContent =
        formatDate(location.localtime);


    document.getElementById("temperature").textContent =
        `${Math.round(current.temp_c)}°`;


    document.getElementById("condition").textContent =
        current.condition.text;


    document.getElementById("feelsLike").textContent =
        `${Math.round(current.feelslike_c)}°`;


    document.getElementById("weatherIcon").src =
        "https:" + current.condition.icon;


    document.getElementById("humidity").textContent =
        `${current.humidity}%`;


    document.getElementById("wind").textContent =
        `${current.wind_kph} km/h`;


    document.getElementById("visibility").textContent =
        `${current.vis_km} km`;


    document.getElementById("pressure").textContent =
        `${current.pressure_mb} mb`;


    document.getElementById("summaryFeels").textContent =
        `${Math.round(current.feelslike_c)}°`;


    document.getElementById("windDirection").textContent =
        current.wind_dir;


    document.getElementById("uv").textContent =
        current.uv;


    document.getElementById("cloud").textContent =
        `${current.cloud}%`;

}


function updateForecast(data) {

    const container =
        document.getElementById("forecastContainer");


    container.innerHTML = "";


    data.forecast.forecastday.forEach((day) => {

        const date = new Date(day.date);


        const dayName = date.toLocaleDateString(
            "en-US",
            {
                weekday: "short"
            }
        );


        const card = document.createElement("div");

        card.className = "forecast-card";


        card.innerHTML = `

            <div class="forecast-day">
                ${dayName}
            </div>

            <img
                src="https:${day.day.condition.icon}"
                alt="${day.day.condition.text}"
            >

            <div class="forecast-condition">
                ${day.day.condition.text}
            </div>

            <div class="forecast-temp">
                ${Math.round(day.day.maxtemp_c)}°
                <span class="forecast-low">
                    ${Math.round(day.day.mintemp_c)}°
                </span>
            </div>

        `;


        container.appendChild(card);

    });

}


locationBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {

        showError("Geolocation is not supported by your browser.");

        return;

    }


    showLoading();


    navigator.geolocation.getCurrentPosition(

        (position) => {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;


            getWeather(`${latitude},${longitude}`);

        },


        () => {

            hideLoading();

            showError(
                "Unable to get your location. Please search for a city."
            );

        }

    );

});


function formatDate(dateString) {

    const date = new Date(dateString.replace(" ", "T"));


    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric"
        }
    );

}


// ==========================================

function showLoading() {

    loading.style.display = "flex";

}


function hideLoading() {

    loading.style.display = "none";

}

// ==========================================

function showError(message) {

    errorText.textContent = message;

    errorMessage.style.display = "flex";

}


function hideError() {

    errorMessage.style.display = "none";

}

getWeather("Karachi");