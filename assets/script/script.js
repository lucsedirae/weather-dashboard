//var date = moment(timestamp * 1000).format("dddd");


// openweather.org and locationIQ api keys:
const apiKey = "22ce314bdb5cf097792a93d02ec2e354";
const coordsApiKey = "pk.76e56d2c826e09cd5f6fd3cd586d26e7";
//retrieves stored city names
const cityJSONObj = JSON.parse(localStorage.getItem("storedCities"));
//holds the current list of active cities
var cityList = [];
//Stores currently selected city
var currentCity = "Richmond";
//Stores current day
var currentDay = moment().format("dddd");
var currentDayNumber = 0;
//Creates an empty object where relevant current weather API data will be stored
var currentWeatherObj = {};
//Creates an empty object where relevant forecast API data will be stored
var forecastObj = {};
//Creates objects that round the currentCity's coordinates so that they can be passed to openweather API url
var longitudeRounded = 0;
var latitudeRounded = 0;
//Stores the current UV index value
var currentUV = 0;
//weekDays lists days of the week twice in order to allow a looping of the calendar week in
//populateForecast()
const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

//waits until document is fully loaded then initializes the script
$(document).ready(function () {
  $("#detail-list").html(
    "<h2 id='placeholder-detail'>Every silver lining's got a touch of grey...</h2>"
  );
  //Loop assigns a numeric value to the current day of the week. This value will be added to the
  //index of k in populateForecast() in order to populate cards starting with the current day
  //weekDays.length is divided by two in order to allow a looping of the calendar week in
  //populateForecast()
  for (var l = 0; l < weekDays.length / 2; l++) {
    if (currentDay === weekDays[l]) {
      currentDayNumber = l;
    }
  }
  retrieveCoordinatesAPI();
  retrieveCurrentAPI();
  retrieveForecastAPI();
  writeList();
  //Listens for a submission to input a new city
  $("#submit-button").click(newCity);
  //Listens for a click on a city name to set the currentCity
  $("li").click(setCurrentCity);
  //get the user's input, prepend it to DOM city list, and save to local storage
  function newCity() {
    var userInput = $("#user-input").val();
    currentCity = userInput;

    retrieveCoordinatesAPI();
    retrieveCurrentAPI();
    retrieveForecastAPI();
    populateCurrentWeather();
    if (cityJSONObj === null) {
      $("#temp-city").remove();
      cityList.push(userInput);
      $("#city-list").prepend(
        "<li id='city" + (cityList.length - 1) + "'>" + userInput + "</li>"
      );
    } else {
      cityList = cityJSONObj;
      cityList.push(userInput);
      $("#city-list").prepend("<li>" + userInput + "</li>");
    }
    $("#user-input").val("");
    localStorage.setItem("storedCities", JSON.stringify(cityList));
    populateCurrentWeather();
  }

  //writes the current city's weather details to the DOM's jumbotron element
  function populateCurrentWeather() {
    retrieveUVIndexAPI();
    $("#detail-list").empty();
    // $("#weather-icon").empty();
    $("#forecast-row").empty();
    populateForecast();

    $("#detail-list").append(
      "<h2 id='details-header'>" + currentCity + "</h2>"
    );
    $("#weather-icon").replaceWith(
      "<img src='http://openweathermap.org/img/wn/" +
        currentWeatherObj.icon +
        "@4x.png' id='weather-icon' alt='Weather Icon'/>"
    );
    $("#detail-list").append(
      "<li>Temperature: " + currentWeatherObj.temp + "°</li>"
    );
    $("#detail-list").append(
      "<li>Humidity: " + currentWeatherObj.humidity + "%</li>"
    );
    $("#detail-list").append(
      "<li>Wind Speed: " + currentWeatherObj.windspeed + " mph</li>"
    );
    $("#detail-list").append("<li>UV Index: " + currentUV + "</li>");
  }

  //populates the card row with a series of five day forecast cards
  function populateForecast() {
    $(".card").empty();

    for (var k = 0; k < 5; k++) {
      $("#forecast-row").append(
        "<div class='col-md-2'><div class='card'><div class='card-body'><h5 class='card-title'>" +
          weekDays[currentDayNumber + (k + 1)] +
          "</h5><ul id='card-list'><li class='card-item'>Temp: " +
          forecastObj[k].main.temp +
          "°</li><li class='card-item'>Humidity: " +
          forecastObj[k].main.humidity +
          "</li></ul><img src='https://openweathermap.org/img/wn/" +
          forecastObj[k].weather[0].icon +
          "@2x.png' id='weather-icon' alt='Weather Icon'/></div></div></div>"
      );
    }
  }

  function retrieveCoordinatesAPI() {
    $.ajax({
      url:
        "https://us1.locationiq.com/v1/search.php?key=" +
        coordsApiKey +
        "&q=" +
        currentCity +
        "&format=json",
      method: "GET",
    }).then(function (returns) {
      var longitude = returns[0].lon;
      var latitude = returns[0].lat;
      longitudeRounded = Math.round(longitude * 1000) / 1000;
      latitudeRounded = Math.round(latitude * 1000) / 1000;
    });
  }

  //Creates the api call retrieving current weather data from openweather.org
  function retrieveCurrentAPI() {
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        currentCity +
        "&units=imperial&appid=" +
        apiKey,
      method: "GET",
    }).then(function (response) {
      //response is the object retrieved by the api call
      currentWeatherObj = {
        temp: response.main.temp,
        humidity: response.main.humidity,
        windspeed: response.wind.speed,
        icon: response.weather[0].icon,
      };
    });
  }

  //Creates the api call retrieving forecast data from openweather.org
  function retrieveForecastAPI() {
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        currentCity +
        "&units=imperial&appid=" +
        apiKey,
      method: "GET",
    }).then(function (reply) {
      for (var m = 0; m < 5; m++) {
        forecastObj[m] = reply.list[m + 8];
      }
    });
  }

  function retrieveUVIndexAPI() {
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/uvi?lat=" +
        latitudeRounded +
        "&lon=" +
        longitudeRounded +
        "&appid=" +
        apiKey,
      method: "GET",
    }).then(function (uvresults) {
      currentUV = uvresults.value;
      console.log(uvresults);
    });
  }

  //replaces the currentCity var value and updates the API call with the new city name
  function setCurrentCity() {
    currentCity = $(this).text();
    retrieveCoordinatesAPI();
    retrieveCurrentAPI();
    retrieveForecastAPI();
    populateCurrentWeather();
  }

  //write the stored cities to the DOM city list
  function writeList() {
    $("#city-list").empty();
    if (cityJSONObj != null) {
      cityList = cityJSONObj;
      currentCity = cityJSONObj[0];
      for (var i = 0; i < cityList.length; i++) {
        $("#city-list").prepend(
          "<li id='city" + i + "'>" + cityList[i] + "</li>"
        );
      }
    } else {
      $("#city-list").prepend(
        "<li id='temp-city'>Search for a city to check the weather</li>"
      );
    }
    return;
  }
});