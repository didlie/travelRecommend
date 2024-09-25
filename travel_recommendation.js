var travelData;

    fetch("./travel_recommendation_api.json")
    .then(data=>{
        travelData = data.json();
        console.log(travelData)
    })
    .catch((error)=>{
        console.log(error);
    });


