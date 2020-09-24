// openweather.org api key:
var apiKey = "22ce314bdb5cf097792a93d02ec2e354";
var currentCity = "Richmond";
var cityJSONObj = JSON.parse(localStorage.getItem("storedCities"));
var cityList = [];

//waits until document is fully loaded then initializes the script
$(document).ready(function () {
  //sets cityList to the stored array value

  //write the stored cities to the DOM city list
  if (cityJSONObj != null) {
    cityList = cityJSONObj;
    console.log(cityList);
    for (var i = 0; i < cityList.length; i++) {
      $("#city-list").prepend("<li>" + cityList[i] + "</li>");
    }
  } else {
    $("#city-list").prepend("<li>Richmond</li>");
  }

  //get the user's input, prepend it to DOM city list, and save to local storage
  $("#submit-button").click(function () {
    var userInput = $("#user-input").val();
    console.log(userInput);

    if (cityJSONObj === null) {
      cityList.push(userInput);
      $("#city-list").prepend("<li>" + userInput + "</li>");
      console.log(cityList);
    } else {
      cityList = cityJSONObj;
      cityList.push(userInput);
      $("#city-list").prepend("<li>" + userInput + "</li>");
    }
    localStorage.setItem("storedCities", JSON.stringify(cityList));
  });

  //Creates the api call retrieving data from openweather.org
  $.ajax({
    url:
      "http://api.openweathermap.org/data/2.5/weather?q=" +
      currentCity +
      "&appid=" +
      apiKey,
    method: "GET",
  }).then(function (response) {
    //response is the object retrieved by the api call
    console.log(response);
  });

  //display current weather details to detail jumbotron

  //Break down and append 5 day forecast
});
