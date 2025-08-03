
const API_KEY = 'fb36d3ad0cf349dabee192722252607'; 
const BASE_URL = 'https://api.weatherapi.com/v1/forecast.json';

const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');


const day1Name = document.getElementById('day1Name'); 
const day1Date = document.getElementById('day1Date');
const cityNameElement = document.getElementById('cityName');
const currentTempElement = document.getElementById('currentTemp');
const currentWeatherIcon = document.getElementById('currentWeatherIcon');
const currentConditionElement = document.getElementById('currentCondition');


const day2Name = document.getElementById('day2Name');
const day2Icon = document.getElementById('day2Icon');
const day2MaxTemp = document.getElementById('day2MaxTemp');
const day2MinTemp = document.getElementById('day2MinTemp');
const day2Condition = document.getElementById('day2Condition');


const day3Name = document.getElementById('day3Name');
const day3Icon = document.getElementById('day3Icon');
const day3MaxTemp = document.getElementById('day3MaxTemp');
const day3MinTemp = document.getElementById('day3MinTemp');
const day3Condition = document.getElementById('day3Condition');



async function getWeatherData(city) {
    if (!city || city.length < 2) {
        updateUI(null); 
        return null; 
    }

    const url = `${BASE_URL}?key=${API_KEY}&q=${city}&days=3&aqi=no&alerts=no&lang=en`; 
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
          
            if (response.status === 400) {
               
               
            } else {
                console.error(`Error: ${response.statusText}`);
                alert('An error occurred while connecting to the weather service.'); 
            }
            updateUI(null); 
            return null; 
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('An error occurred while connecting to the weather service. Please try again later.');
        updateUI(null); 
        return null;
    }
}


function updateUI(data) {
    if (!data) {
       
        cityNameElement.textContent = '';
        day1Name.textContent = '';
        day1Date.textContent = '';
        currentTempElement.textContent = '';
        currentWeatherIcon.src = '';
        currentWeatherIcon.alt = '';
        currentConditionElement.textContent = '';

        day2Name.textContent = '';
        day2Icon.src = '';
        day2MaxTemp.textContent = '';
        day2MinTemp.textContent = '';
        day2Condition.textContent = '';

        day3Name.textContent = '';
        day3Icon.src = '';
        day3MaxTemp.textContent = '';
        day3MinTemp.textContent = '';
        day3Condition.textContent = '';
        return;
    }

    const forecast = data.forecast.forecastday;

    const todayData = forecast[0];
    const todayDate = new Date(todayData.date);
  
    day1Name.textContent = todayDate.toLocaleDateString('en-US', { weekday: 'long' }); 
    day1Date.textContent = todayDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' }); 
    
    cityNameElement.textContent = data.location.name;
    currentTempElement.textContent = Math.round(data.current.temp_c) + '°C';
    currentWeatherIcon.src = `https:${data.current.condition.icon}`; 
    currentWeatherIcon.alt = data.current.condition.text;
    currentConditionElement.textContent = data.current.condition.text;

   
    if (forecast[1]) {
        const day2 = forecast[1];
        const day2FullDate = new Date(day2.date);
        day2Name.textContent = day2FullDate.toLocaleDateString('en-US', { weekday: 'long' });
        day2Icon.src = `https:${day2.day.condition.icon}`; 
        day2Icon.alt = day2.day.condition.text;
        day2MaxTemp.textContent = Math.round(day2.day.maxtemp_c);
        day2MinTemp.textContent = Math.round(day2.day.mintemp_c);
        day2Condition.textContent = day2.day.condition.text;
    } else {
      
        day2Name.textContent = 'N/A';
        day2Icon.src = '';
        day2MaxTemp.textContent = '';
        day2MinTemp.textContent = '';
        day2Condition.textContent = '';
    }

   
    if (forecast[2]) {
        const day3 = forecast[2];
        const day3FullDate = new Date(day3.date);
        day3Name.textContent = day3FullDate.toLocaleDateString('en-US', { weekday: 'long' });
        day3Icon.src = `https:${day3.day.condition.icon}`; 
        day3Icon.alt = day3.day.condition.text;
        day3MaxTemp.textContent = Math.round(day3.day.maxtemp_c);
        day3MinTemp.textContent = Math.round(day3.day.mintemp_c);
        day3Condition.textContent = day3.day.condition.text;
    } else {
      
        day3Name.textContent = 'N/A';
        day3Icon.src = '';
        day3MaxTemp.textContent = '';
        day3MinTemp.textContent = '';
        day3Condition.textContent = '';
    }
}


function getWeatherDataByCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const data = await getWeatherData(`${lat},${lon}`);
            updateUI(data);
 
            if (data && data.location && data.location.name) {
                cityInput.value = data.location.name;
            }
        }, (error) => {
            console.error('Geolocation error:', error);
           
            searchCity('Cairo'); 
        });
    } else {
       
        searchCity('Cairo');
    }
}


async function searchCity(city) {
    if (!city) {
        
        updateUI(null); 
        return;
    }
    const data = await getWeatherData(city);
    updateUI(data);
}

cityInput.addEventListener('input', () => {
    const city = cityInput.value.trim();
    searchCity(city);
});


searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    searchCity(city);
});


document.addEventListener('DOMContentLoaded', () => {
    getWeatherDataByCurrentLocation();
});