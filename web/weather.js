const weather = {
    apiKey: "28096295eb1edd766e38417af95306a0",
  
    fetchWeather: function (city) {
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
          city +
          "&units=metric&appid=" +
          this.apiKey
      )
        .then((response) => {
          if (!response.ok) {
            alert("No weather found.");
            throw new Error("No weather found.");
          }
          return response.json();
        })
        .then((data) => this.displayWeather(data))
        .catch((error) => console.error("Error fetching weather data: ", error));
    },
  
    fetchForecast: function (city) {
      fetch(
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
          city +
          "&units=metric&appid=" +
          this.apiKey
      )
        .then((response) => {
          if (!response.ok) {
            alert("No forecast found.");
            throw new Error("No forecast found.");
          }
          return response.json();
        })
        .then((data) => this.displayForecast(data))
        .catch((error) => console.error("Error fetching forecast data: ", error));
    },
  
    displayWeather: function (data) {
      const { name } = data;
      const { icon, description } = data.weather[0];
      const { temp, humidity } = data.main;
      const { speed } = data.wind;
  
      document.querySelector(".city").innerText = "Weather in " + name;
      document.querySelector(".icon").src =
        "https://openweathermap.org/img/wn/" + icon + ".png";
      document.querySelector(".description").innerText = description;
      document.querySelector(".temp").innerText = temp + "°C";
      document.querySelector(".humidity").innerText =
        "Humidity: " + humidity + "%";
      document.querySelector(".wind").innerText =
        "Wind speed: " + speed + " km/h";
      document.querySelector(".weather").classList.remove("loading");
  
      this.fetchForecast(name);
    },
  
    displayForecast: function (data) {
      const forecastElement = document.querySelector(".forecast");
      forecastElement.innerHTML = "";
  
      for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const { dt_txt } = forecast;
        const { icon, description } = forecast.weather[0];
        const { temp } = forecast.main;
  
        const forecastDayElement = document.createElement("div");
        forecastDayElement.classList.add("forecast-day");
  
        forecastDayElement.innerHTML = `
          <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}">
          <div class="date">${new Date(dt_txt).toDateString()}</div>
          <div class="description">${description}</div>
          <div class="temp">${temp}°C</div>
        `;
  
        forecastElement.appendChild(forecastDayElement);
      }
    },
  
    search: function () {
      const searchBar = document.querySelector(".search-bar");
      const city = searchBar.value;
      if (city.trim() === "") {
        alert("Please enter a city name.");
        return;
      }
      this.fetchWeather(city);
    },
  };
  
  document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
  });
  
  document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      weather.search();
    }
  });
  
  weather.fetchWeather("Kuala Terengganu");
  