// openweather.org api key:
const apiKey = "22ce314bdb5cf097792a93d02ec2e354";
//retrieves stored city names
const cityJSONObj = JSON.parse(localStorage.getItem("storedCities"));
//holds the current list of active cities
var cityList = [];
//tracks currently selected city
var currentCity = "Richmond";
//Creates an empty object where relevant API data will be stored
var currentWeatherObj = {};
//Array storing days of the week for 5-day forecast
const weekDays = [
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
  writeList();
  retrieveAPI();
  populateCurrentWeather();
  //Listens for a submission to input a new city
  $("#submit-button").click(newCity);
  //Listens for a click on a city name to set the currentCity
  $("li").click(setCurrentCity);

  //get the user's input, prepend it to DOM city list, and save to local storage
  function newCity() {
    var userInput = $("#user-input").val();
    currentCity = userInput;
    retrieveAPI();
    populateCurrentWeather();
    console.log(userInput);

    if (cityJSONObj === null) {
      $("#temp-city").remove();
      cityList.push(userInput);
      $("#city-list").prepend(
        "<li id='city" + (cityList.length - 1) + "'>" + userInput + "</li>"
      );
      console.log(cityList);
    } else {
      cityList = cityJSONObj;
      cityList.push(userInput);
      $("#city-list").prepend("<li>" + userInput + "</li>");
    }
    $("#user-input").text("Enter a city");
    localStorage.setItem("storedCities", JSON.stringify(cityList));
  }

  //writes the current city's weather details to the DOM's jumbotron element
  function populateCurrentWeather() {
    $("#detail-list").empty();
    // $("#weather-icon").empty();

    //current city
    $("#detail-list").append("<h2 id='details-header'>"+currentCity+"</h2>");

    //weather icon
    $("#weather-icon").replaceWith("<img src='http://openweathermap.org/img/wn/"+currentWeatherObj.icon+"@4x.png' id='weather-icon' alt='Weather Icon'/>");

    //temperature
    $("#detail-list").append("<li>Temperature: "+currentWeatherObj.temp+"°</li>");

    //Humidity
    $("#detail-list").append("<li>Humidity: "+currentWeatherObj.humidity+"%</li>");

    //Wind Speed
    $("#detail-list").append("<li>Wind Speed: "+currentWeatherObj.windspeed+" mph</li>");

    //UV index
    $("#detail-list").append("<li>UV Index: </li>");

  }

  //Creates the api call retrieving data from openweather.org
  function retrieveAPI() {
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        currentCity +
        "&units=imperial&appid=" +
        apiKey,
      method: "GET",
    }).then(function (response) {
      //response is the object retrieved by the api call
      console.log(response);

      currentWeatherObj = {
        temp: response.main.temp,
        humidity: response.main.humidity,
        windspeed: response.wind.speed,
        icon: response.weather[0].icon
      }
      console.table(currentWeatherObj);
    });
  }

  //replaces the currentCity var value and updates the API call with the new city name
  function setCurrentCity() {
    currentCity = $(this).text();
    console.log(currentCity);
    retrieveAPI();
    populateCurrentWeather();
  }

  //write the stored cities to the DOM city list
  function writeList() {
    $("#city-list").empty();
    if (cityJSONObj != null) {
      cityList = cityJSONObj;
      console.log(cityList);
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

  //Break down and append 5 day forecast
});
