/****DOM constants */
const clearButton = document.getElementById("btnReset");
const searchButton = document.getElementById("btnSearch");
const searchInput = document.getElementById("searchInput");

clearButton.onclick = clearResults;
searchButton.onclick = searchTravelData;

/********** search travel data ******/
var travelData = {};//initialize as an object

function searchTravelData(){ 

    fetch("./travel_recommendation_api.json")
    .then(response => response.json())
    .then(data => {
        travelData = data;
        console.log(travelData);

        /***match words from the search terms with the data returned from the fetch */
        matchWordsFromSearchWithResults();

    })
    .catch((error)=>{
        console.log(error);
    });
};

function matchWordsFromSearchWithResults(){
    //uses global travelData
    //uses ref to global const searchInput
    var searchWordsString = searchInput.value.toLowerCase();
    var searchWordArray = [];
    var results  = [];
    searchWordArray = searchWordsString.split(" ");
/***display all results if no search words are entered */
console.log(searchWordArray);
    if(searchWordArray[0]=== ''){
        console.log("nothing in the search input");
        displayAllResults();
        return;//stop search
    }
/********************heigherarchy for search */
/******first check the top level object keys */
    searchWordArray.forEach((word)=>{
        if(travelData[word] !== undefined){
            travelData[word].forEach(isObject => {
                results.push(isObject);
            });
        }

/*** now search the specific listings arrays for each object */
/*** from each key; match "name" from each object in the arrays***/
/**********return the specific result from  the top-level object */

        Object.keys(travelData).forEach(key => {
            //key - of top level item
            let arrayOfObjects = travelData[key];
            //search each word in the result 'name'
            arrayOfObjects.forEach(isObject => {
            let name =  isObject.name.toLowerCase();
            let wordArray = name.split(" ");
            //match each word to each word in the search
            if(wordArray[word] !== undefined){
                    //check if the result is already in the array - no duplicates
                    if(!results.includes(isObject)){ results.push(isObject); };
                    //also, upgrade by pushing multiple result matches 
                    //to the top of the results array
            }
            });
            
        });

/**************continue the logic to each */
/**** where the description matches two words or something */

//som more code here
    });

/******now display the results in formated blocks */
    displayFormatedResults(results);

}

function formatResults(result){
    //wrap contents of result in div, and return
    let c = document.createElement("div");
    c.innerHTML = JSON.stringify(result);
    return c;
}

function displayFormatedResults(results){
    let resDiv = document.getElementById("results");
    let divArray = results.map(result => {
        formatResults(result);
    });
    divArray.forEach((block)=>{
        resDiv.appendChild(block);
    });
    resDiv.style.display = "block";
    console.log("results displayed");
}

function displayAllResults(){
    //logic to display each item from the results in travelData, 
    //starting with each array key
    console.log("displaying all results");
    Object.keys(travelData).forEach(key=>{

    }) 
}

/***used for button to clear the results */
/*and button to display results 
/* and onfocus for search bar */
function clearResults(){
    let resDiv = document.getElementById("results");
    resDiv.innerHTML = "";
    resDiv.style.display = "none";
    travelData = {};
}
/*******function for time of searched location */
var searchedLocation;

function getCityTime(){
    const options = { timeZone: searchedLocation, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formatedTime = new Date().toLocaleTimeString('en-US', options);
    return "Current time in ${city}:" + formatedTime;
}
/******************************************88 */





