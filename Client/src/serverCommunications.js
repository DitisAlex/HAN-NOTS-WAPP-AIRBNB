const axios = require("axios");

const apiURL = "https://localhost:7267"; //https://localhost:7267 & https://airbnbserver.azurewebsites.net
/**
 * Fetch all listings and transform into geoJSON
 */
export async function getListingsGeo(params) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${apiURL}/listings`, { params })
      .then(async function(response) {
        if (response.data) {
          let geoJSON = {
            type: "FeatureCollection",
            features: [],
          };

          response.data.forEach((element) => {
            let newLongitude =
              String(element.longitude).slice(0, 1) +
              "." +
              String(element.longitude).slice(1);
            let newLatitude =
              String(element.latitude).slice(0, 2) +
              "." +
              String(element.latitude).slice(2);

            geoJSON.features.push({
              type: "Feature",
              properties: {
                id: element.id,
                name: element.name,
                hostName: element.hostName,
                neighbourhood: element.neighbourhood,
                price: element.price,
                reviewScoresRating: element.reviewScoresRating,
              },
              geometry: {
                type: "Point",
                coordinates: [
                  parseFloat(newLongitude),
                  parseFloat(newLatitude),
                ],
              },
            });
          });
          resolve(geoJSON);
        }
      })
      .catch((e) => {
        console.log(e);
        reject(e);
      });
  });
}

/**
 * Fetch specific listings by id
 */
export async function getListing(id) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${apiURL}/listings/${id}`)
      .then(async function(response) {
        if (response.data) {
          resolve(response);
        }
      })
      .catch((e) => {
        console.log(e);
        reject(e);
      });
  });
}

/**
 * Fetch all statistics
 */
export async function getStats(token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return new Promise((resolve, reject) => {
    axios
      .get(`${apiURL}/listings/stats`, config)
      .then(async function(response) {
        if (response.data) {
          resolve(response);
        }
      })
      .catch((e) => {
        console.log(e);
        reject(e);
      });
  });
}

/**
 * Fetch all neighbourhoods
 */
export async function getNeighbourhoods() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${apiURL}/listings/neighbourhoods`)
      .then(async function(response) {
        if (response.data) {
          resolve(response);
        }
      })
      .catch((e) => {
        console.log(e);
        reject(e);
      });
  });
}
