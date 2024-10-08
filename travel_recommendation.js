/****DOM constants */
const clearButton = document.getElementById("btnReset");
const searchButton = document.getElementById("btnSearch");
const searchInput = document.getElementById("searchInput");

clearButton.onclick = clearResults;
searchButton.onclick = searchTravelData;

/********** search travel data ******/
var travelData = {};//initialize as an object

function searchTravelData(){ 
    let resDiv = document.getElementById("")
    clearResults();
    if(travelData.length > 2){
        //enable caching of the travelData
        matchWordsFromSearchWithResults();
        resDiv.style.display = "none";
        return;
    }
//else, fetch
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
    console.log("here are all the search words");
    console.log(searchWordArray);

    if(searchWordArray[0]=== ''){
        console.log("nothing in the search input");
        console.log("displaying all results");
        Object.keys(travelData).forEach(key=>{
            results.push(key);
            travelData[key].forEach(isObject => {
                results.push(isObject);
            });
        });
        console.log("this should be an array of all results");
        console.log(results);
        displayFormatedResults(results);
        return;//stop search
    }
/********************heigherarchy for search */
/******first check the top level object keys */
    searchWordArray.forEach((word)=>{
        Object.keys(travelData).forEach(key => {
            if(key.indexOf(word) > -1){
                travelData[key].forEach(isObject => {
                    results.push(isObject);
                });
            }
        })
    });

    displayFormatedResults(results);

}

function formatResult(result){
    let resDiv = document.getElementById("searchResults");
    if(result.hasOwnProperty("cities")){
        let i = 0;
        while(typeof result.cities[i] === "object" && 
                typeof result.cities[i].name === "string"){
            formatResult(result.cities[i]);
            return;
        }(i++);
        return;
    }
    //wrap contents of result in div, and return
    let c = document.createElement("div");

    if(typeof result == "string"){
        c.innerHTML = result;
        c.style.backgroundColor = "white";
        c.style.color = "blue";
    }else if(typeof result == "object"){

        try {
            if(result.hasOwnProperty("name")){
                let img = document.createElement("img");
                img.src = result.imageUrl;
                img.style.display = "relative";
                img.style.width = "100%";
                let h3 = document.createElement("h3");
                h3.innerHTML = result.name;
                let dp = document.createElement("p");
                dp.innerHTML = result.description;

                c.innerHTML = displayCityTime(result.name);
                c.appendChild(img);
                c.appendChild(h3);
                c.appendChild(dp);
                c.style.backgroundColor = "blue";
                c.style.color = "white";
                }
        } catch (error) {
            console.log("Caught error in listing item: " + error);
        }


        }
    console.log("this should be a div");
    console.log(c);//this looks good
    resDiv.appendChild(c);
    resDiv.style.display = "block";
}

function displayFormatedResults(results){

    console.log("this should be an array of objects");//console
    console.log(results);//console
    //it is an array of objects, WORKS!
    results.map(result=>formatResult(result));
    console.log("results displayed");
}

/***used for button to clear the results */
/*and button to display results 
/* and onfocus for search bar */
function clearResults(){
    let resDiv = document.getElementById("searchResults");
    resDiv.innerHTML = "";
    resDiv.style.display = "none";
    searchInput.value = "";
}

/*******function for time of searched location */
var searchedLocation;

function displayCityTime(city){
    let searchedLocation = getTimeZone(city);
    const options = { timeZone: searchedLocation, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formatedTime = new Date().toLocaleTimeString('en-US', options);
    return `Current time in ${city}:` + formatedTime;
}
/******************************************88 */
function getTimeZone(data){
    let stringData = data.toLowerCase();
    let retVal;
    let zones = {
        australia : "Australia/Sydney",
        japan : "Asia/Tokyo",
        french : "Pacific/Tahiti",
        brazil : "America/Sao_Paulo",
        cambodia : "Asia/Phnom_Penh",
        india : "Asia/Kolkata"
    }
    Object.keys(zones).forEach((key) => {
        if(stringData.indexOf(key) > -1){
            console.log("this was the time zone selected in teh function");
            console.log(zones[key]);
            retVal = zones[key];
            return retVal;
        }
    });
    return retVal;
}


searchInput.addEventListener("keyup", event => {
    inputString = event.data;
    let resDiv = document.getElementById("searchResults");
    resDiv.innerHTML = "";
    matchWordsFromSearchWithResults(inputString);
    resDiv.style.display = "block";
})


searchButton.click();
