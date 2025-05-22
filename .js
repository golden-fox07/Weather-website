// Selecting DOM elements for user input
const cityInput = document.querySelector(".search-city");
const SearchBtn = document.querySelector(".search-btn")

// Selecting DOM elements to display info
const weatherInfoSection = document.querySelector(".weather-info");
const countryTxt = document.querySelector(".country-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValueTxt = document.querySelector(".humidity-value-txt");
const windValueTxt = document.querySelector(".wind-value-txt");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const currentDateTxt = document.querySelector(".current-date-txt");
const forecastItemsContainer = document.querySelector(".forecast-items-container");

// API key from OpenWeatherMap
const apiKey = "8c56e3c0eea8d3ee2b58cb305f1515d4";

SearchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== '') {
        updateWeather(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

// Event listener for using "Enter" key in the input 
cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' &&
        cityInput.value.trim() != ''
    ){
       updateWeather(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

//  Fetch data from the OpenWeatherMap API
async function getFetchData(endPoint, city){
    const api_url = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(api_url)
    return response.json()
}

// Function to get the weather icon based on the weather ID
function getWeatherIcon(id){
    if (id >= 200 && id <= 232) return 'drizzle.png'
    else if (id >= 300 && id <= 321) return 'drizzle.png'
    else if (id >= 500 && id <= 531) return 'rain.png'
    else if (id >= 600 && id <= 622) return 'snow.png'
    else if (id >= 701 && id <= 781) return 'mist.png'
    else if (id === 800) return 'clear.png'
    else if (id >= 801 && id <= 804) return 'clouds.png'
}

// Function to get the current date in a specific format
function getCurrentDate(){
    const currentDate = new Date();
    console.log(currentDate);
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
    }
    return currentDate.toLocaleDateString('en-US', options)
}

// Function to update the weather information
async function updateWeather(city){
    const WeatherDate = await getFetchData('weather', city);
    if (WeatherDate.cod == '404'){
        alert('City not found')
        return
    }
    const {
        name: country,
        main: {temp, humidity},
        weather: [{id, main}],
        wind: {speed}
    } = WeatherDate

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + '°C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + 'M/s'
    currentDateTxt.textContent = getCurrentDate()
    weatherSummaryImg.src = `img/${getWeatherIcon(id)}`

     // Update 5-day forecast
    await updateForecastsInfo(city)

    // Show the weather info section
    showDisplaySection(weatherInfoSection)
}

async function updateForecastsInfo(city){
    const forecastsData = await getFetchData('forecast', city)

    const TimeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastItemsContainer.innerHTML = ''
    forecastsData.list.forEach(forecastWeather => {
       if(forecastWeather.dt_txt.includes(TimeTaken) &&
        !forecastWeather.dt_txt.includes(todayDate)){
        updateForecastsItems(forecastWeather)
        }
    }) 
}
function updateForecastsItems(WeatherDate){
    console.log(WeatherDate);
    const {
        dt_txt: date,
        weather: [{id, main}],
        main: {temp},  
    } = WeatherDate

    const dateTaken = new Date(date)
    const dateOptions = {
        day: '2-digit',
        month: 'short', 
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOptions)

    const forecastItem = `
        <div class="forecast-item">
          <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
          <img src="img/${getWeatherIcon(id)}" class="forecast-item-img">
          <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div> `

     // Add the forecast item to the forecast container
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}

// function to show the weather information section
function showDisplaySection(section) {
    weatherInfoSection.style.display = 'flex';
}