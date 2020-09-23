// openweather.org api key:
var apiKey = "22ce314bdb5cf097792a93d02ec2e354";

//waits until document is fully loaded then initializes the script
$(document).ready(function(){


//Creates the api call retrieving data from openweather.org
$.ajax({
    url: "api.openweathermap.org/data/2.5/weather?q={city name}&appid=" + apiKey,
    method: "GET"
}).then(function(response){
    console.log(response);
})







});