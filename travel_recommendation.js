var travelData;

    fetch("./travel_recommendation_api.json")
    .then((data)=>{
        travelData = data.json;
    })
    .catch((error)=>{
        console.log(error);
    });


