
"use strict";

const npsApiKey = "Xc8Z9iz4eukphHpAZIMXwKaQ8bfP6Tl4dBhXoXiR";
const npsSearchURL = "https://developer.nps.gov/api/v1/parks?api_";

const weatherApiKey = "77e0f092ff8c489aa8fe507cb942e633";
const weatherSearchURL = "https://api.weatherbit.io/v2.0/forecast/daily?";

const suggestionAPIKeyClient = "J2OYBRJYIRVZJCLVFDQZNXJUIUYT2JZYIYQ3OFJ0D2WQ0D0N";
const suggestionApiKey = "XGXG155FFGLLKP3PT4OEHFJNPPIMS0Z0VFDKQOBUQ24A25MU";
const suggestionSearchURL = "https://api.foursquare.com/v2/venues/explore?";



function watchForm() {
  $("#js-form").submit(event => {
    event.preventDefault();
    $("#js-error-message").addClass("hidden");
    const searchTerm = $("#js-search-term").val();
    finalOutdoorArr = [];
    finalGroceryArr = [];
    finalNightlifeArr=[];
    nightLifeObj= {};
    groceryObj={};
    outdoorsObj={};
    results = {};
    arr = [];
    finalForecastArr = [];
    resultsArr = [];
    $("#results-list").empty();
    getParks(searchTerm);
  });
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join("&");
}
let results = {};
let resultsArr = [];

function watchReset() {
  $(".reset").click(event => {
    $(".loader").addClass("hidden")
    $("#results").addClass("hidden");
    $("#js-search-term").val("WI");

  });
  watchForm();
}
let arr = [];
let arrayZip=[];


function displayResults(responseJson) {

  if (responseJson.total == 0) {
    $(".loader").addClass("hidden");
    $("#js-error-message").text("No results. Try another search!");
    $("#js-error-message").removeClass("hidden");
    $("#results").addClass("hidden");

  }
  else {
    let resultsCount=[]
    $("#results-list").empty();
    
    for (let i = 0; i < responseJson.data.length; i++) {
      arr.push(responseJson.data[i].name);
      resultsCount.push(arr[i]);
    }
    
    $("#results-list").append(`<p>${resultsCount.length} Search Results</p>`);
    for (let i=0; i<resultsCount.length; i++){
      results[i]={};
      results[i].name = responseJson.data[i].name;
      results[i].description= responseJson.data[i].description;
      results[i].address = {};
      results[i].address.line1 = responseJson.data[i].addresses[1].line1;
      results[i].address.line2= responseJson.data[i].addresses[1].line2;
      results[i].address.line3 = responseJson.data[i].addresses[1].line3;
      results[i].address.city = responseJson.data[i].addresses[1].city;
      results[i].address.state= responseJson.data[i].addresses[1].stateCode;
      results[i].address.zip = responseJson.data[i].addresses[1].postalCode;
      results[i].url= responseJson.data[i].url; 
      results[i].weather={};
      results[i].entertainment={};
      getWeather(results[i].address.zip);
      for(let j=0; j<finalForecastArr.length; j++){
        if (finalForecastArr[j].zipCode===results[i].address.zip){
          results[i].weather=finalForecastArr[j];
        }
      }
      if(results[i].weather.today===undefined || results[i].weather.tomorrow===undefined || results[i].weather.nextDay===undefined || results[i].weather.description1===undefined || results[i].weather.description2===undefined || results[i].weather.description3===undefined){
        results[i].weather.today="No Data"
        results[i].weather.tomorrow="No Data" 
        results[i].weather.nextDay="No Data" 
        results[i].weather.description1="No Data" 
        results[i].weather.description2="No Data" 
        results[i].weather.description3="No Data"
        results[i].weather.img1="c02d"
        results[i].weather.img2="c02d"
        results[i].weather.img3="c02d"

      }
    
    
    

      getSuggestions(results[i].address.zip);
      for(let j=0; j<finalNightlifeArr.length; j++){
        if (finalNightlifeArr[j].zipCode===results[i].address.zip){
          results[i].entertainment.nightLife=finalNightlifeArr[j].nightlife;
        } 
        
      }
      if(results[i].entertainment.nightLife===undefined){
        results[i].entertainment.nightLife='None'
      }

      for(let j=0; j<finalGroceryArr.length; j++){
        if (finalGroceryArr[j].zipCode===results[i].address.zip){
          results[i].entertainment.grocery=finalGroceryArr[j].grocery;
        }
      }
      if(results[i].entertainment.grocery===undefined){
        results[i].entertainment.grocery='None'
      }
      for(let j=0; j<finalOutdoorArr.length; j++){
        if (finalOutdoorArr[j].zipCode===results[i].address.zip){
          results[i].entertainment.outdoors=finalOutdoorArr[j].outdoors;
        }
      }
      if(results[i].entertainment.outdoors===undefined){
        results[i].entertainment.outdoors='None'
      }


      $("#results-list").append(`<div class="border"><h2 class="parkName">${results[i].name}</h2><p>${results[i].description}</p><section class="grid-holder"><ul class="grid-hold" class="parkAddress">Address<li>${results[i].address.line1}</li><li>${results[i].address.line2}</li><li>${results[i].address.line3}</li><li>${results[i].address.city}, ${results[i].address.state} ${results[i].address.zip} </li></ul><ul class="grid-hold"><a href="${results[i].url}" target="_blank"><li class="parkButton">Park Website</a></li></ul></section><p><img src="weather.png"></p><h2>Check out the forecast</h2><p class="bold">Forecast for ${results[i].name}:</p><section class="grid-container"> <ul> <li class="grid-item">Today: ${results[i].weather.today}</li><li class="grid-item"> ${results[i].weather.description1}</li><li id="first" ><img class="grid-item" src='./icons/${results[i].weather.img1}.png'></li></ul><ul><li class="grid-item">Tomorrow: ${results[i].weather.tomorrow}</li><li class="grid-item">${results[i].weather.description2}</li><li id="second" ><img  class="grid-item" src='./icons/${results[i].weather.img2}.png'></li></ul><ul><li class="grid-item">Next Day: ${results[i].weather.nextDay}</li><li class="grid-item">${results[i].weather.description3}</li><li  id="third"><img class="grid-item" src='./icons/${results[i].weather.img3}.png'></li></ul></section><p><img class="park" src="park.png"><h2>Check out the Nearby Attractions for ${results[i].name}</h2></p><ul><h3>Night Life:</h3><li> ${results[i].entertainment.nightLife}</li></ul><ul><h3>Grocery & Fast food:</h3> <li> ${results[i].entertainment.grocery}</li></ul><ul><h3>Outdoor Recreation:</h3> <li> ${results[i].entertainment.outdoors}</li></ul></div>`)
    }    


    
    $(".loader").addClass("hidden")
    $("#results").removeClass("hidden");
  }

}


function getParks(query) {
  const params = {
    key: npsApiKey,
    stateCode: query,
  };
  const queryString = formatQueryParams(params) + "&fields=addresses"
  const url = npsSearchURL + queryString;

  console.log(url);
  $(".loader").removeClass("hidden");
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
      $("#results-list").append("<p>Something went wrong, please try again.</p>");
    });
}

// weather API data below


async function getWeather(query) {
  const params = {
    key: weatherApiKey,
    postal_code: query,
    

  };
  const queryString = formatQueryParamsWeather(params)
  const url = weatherSearchURL + queryString;
  const data = await (await (fetch(url)
    .then(response => {
      if (response.ok) {
        
        return response.json()
        
      }
      throw new Error(response.statusText);
    })
   .then(data => displayWeatherResults(data,query))
   .catch(err => {
      $("#js-error-message").text("Something went wrong! Try Another Search")
    })
  ))
}

function formatQueryParamsWeather(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join("&");
}

let forecast = {};
let finalForecastArr = [];
function displayWeatherResults(responseJson,query) {
  forecast={}
  forecast = {
    zipCode: query,
    today: Math.trunc((responseJson.data[0].temp*9/5)+32) + "&deg F",
    description1: responseJson.data[0].weather.description,
    img1: responseJson.data[0].weather.icon,
    tomorrow: Math.trunc((responseJson.data[1].temp*9/5)+32) + "&deg F",
    description2: responseJson.data[1].weather.description,
    img2: responseJson.data[1].weather.icon,
    nextDay: Math.trunc((responseJson.data[2].temp*9/5)+32)+ "&deg F",
    description3: responseJson.data[2].weather.description,
    img3: responseJson.data[2].weather.icon,
  };
  
  
  finalForecastArr.push(forecast);
}

async function getSuggestions(query) {
  const params = {
    near: query,
    client_id: suggestionAPIKeyClient,
    client_secret: suggestionApiKey,
    v: 20190811,

  };
  const queryString = formatQueryParamsSuggestions(params)
  const url = suggestionSearchURL + queryString;

  
  const data = await (await (fetch(url)
  .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
  
    .then(data => displaySuggestionResults(data ,query))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`)
    })
  ))
}


function formatQueryParamsSuggestions(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join("&");
}

let finalNightlifeArr = [];
let groceryObj = {};
let nightLifeArr = [];
let nightLifeObj= {};
let finalGroceryArr = [];
let groceryArr = [];
let outdoorsArr = [];
let finalOutdoorArr = [];
let outdoorsObj = {};

function displaySuggestionResults(responseJson,query) {
  
  nightLifeArr=[];
  nightLifeObj={};
  groceryArr=[];
  groceryObj={};
  outdoorsArr=[];
  outdoorsObj={};
  

  for (let j = 0; j < responseJson.response.groups[0].items.length; j++) {
    // groceryArr=[];
    // outdoorsArr=[];
    groceryObj={};
    outdoorsObj={}
    // nightLifeArr=[];
    nightLifeObj={};
    
    if (`${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Sports Bar" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Bar" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Brewery") {
      nightLifeArr.push(` ${responseJson.response.groups[0].items[j].venue.name}`)
    }
    
    if (nightLifeArr.length > 0) {
      nightLifeObj= { zipCode: query, nightlife: nightLifeArr };
    }
    else nightLifeObj= { zipCode: query, nightlife: "None" };
    
    finalNightlifeArr.push(nightLifeObj);

    if (`${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Café" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Diner" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Coffee Shop" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Deli / Bodega" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Fast Food Restaurant" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Grocery Store" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Sandwich Place") {
      groceryArr.push(` ${responseJson.response.groups[0].items[j].venue.name}`)
    }
    
    if (groceryArr.length > 0) {
      groceryObj = { zipCode: query, grocery: groceryArr };
    }
    
    else groceryObj = { zipCode: query, grocery: "None" };
    
    finalGroceryArr.push(groceryObj);
    
  
    if (`${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Lake" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Harbor Marina" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}`=== "Bay" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Bike Trail" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Yoga Studio" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Campground" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Botanical Garden" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "State / Provincial Park") {
      outdoorsArr.push(` ${responseJson.response.groups[0].items[j].venue.name}`)
    }
    if (outdoorsArr.length > 0) {
      outdoorsObj = { zipCode: query, outdoors: outdoorsArr };
    }
    else outdoorsObj = {zipCode: query,  outdoors: "None" };
  


  finalOutdoorArr.push(outdoorsObj);
  

  }


}



function createApp() {
  $(".loader").addClass("hidden");
  watchForm();
  watchReset();
}




$(createApp);
