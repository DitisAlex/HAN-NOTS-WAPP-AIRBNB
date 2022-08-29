const axios = require("axios");

/**
 * Fetch all listings and transform into geoJSON
 */
export async function getListingsGeo(){
    return new Promise((resolve, reject) => {
        axios
        .get("https://localhost:7267/listings")
        .then(async function (response) {
          if (response.data) {
            let geoJSON = {
                type: 'FeatureCollection',
                features: []
            };
    
            response.data.forEach(element => {
                let newLongitude = String(element.longitude).slice(0, 1) + "." + String(element.longitude).slice(1);
                let newLatitude = String(element.latitude).slice(0, 2) + "." + String(element.latitude).slice(2)
                
                geoJSON.features.push({
                    type: 'Feature',
                    properties: {
                        id: element.id,
                        name: element.name,
                        hostName: element.hostName,
                        neighbourhood: element.neighbourhood,
                        price: element.price,
                        reviewScoresRating: element.reviewScoresRating,
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(newLongitude), parseFloat(newLatitude)]
                    }
                });
            });
            resolve(geoJSON);
          };
        })
        .catch((e) => {
          console.log(e);
          reject(e);
        });
    })
}