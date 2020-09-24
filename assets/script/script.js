// openweather.org api key:
var apiKey = "22ce314bdb5cf097792a93d02ec2e354";
var currentCity = "Richmond";
var cityJSONObj = JSON.parse(localStorage.getItem("storedCities"));
var cityList = [];
var i = 0;

//waits until document is fully loaded then initializes the script
$(document).ready(function () {

    writeList();
    retrieveAPI();
    $("#submit-button").click(newCity);
    
    //get the user's input, prepend it to DOM city list, and save to local storage
    function newCity() {
        var userInput = $("#user-input").val();
        console.log(userInput);

        if (cityJSONObj === null) {
            $("#temp-city").remove();
            cityList.push(userInput);
            $("#city-list").prepend("<li id='city" + (cityList.length - 1) + "'>" + userInput + "</li>");
            console.log(cityList);
        } else {
            cityList = cityJSONObj;
            cityList.push(userInput);
            $("#city-list").prepend("<li>" + userInput + "</li>");
        }
        $("#user-input").text("Enter a city");
        localStorage.setItem("storedCities", JSON.stringify(cityList));
    };

    //write the stored cities to the DOM city list
    function writeList() {
        $("#city-list").empty();
        if (cityJSONObj != null) {
            cityList = cityJSONObj;
            console.log(cityList);
            for (i = 0; i < cityList.length; i++) {
            $("#city-list").prepend("<li id='city" + i + "'>" + cityList[i] + "</li>");
            }
        } else {
            $("#city-list").prepend("<li id='temp-city'>Search for a city to check the weather</li>");
        }
        return;
    };

    //Creates the api call retrieving data from openweather.org
    function retrieveAPI(){
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
    }
    //display current weather details to detail jumbotron

    //Break down and append 5 day forecast
});
