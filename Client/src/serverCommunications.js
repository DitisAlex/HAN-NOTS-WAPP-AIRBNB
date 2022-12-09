import { graphConfig } from "./authentication/authConfig";
const axios = require("axios");

/**
 * Fetch all listings and transform into geoJSON
 */
export async function getListingsGeo() {
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJodHRwczovL2FpcmJuYmFjLm9ubWljcm9zb2Z0LmNvbS80NGM0YmU3YS0xNjJhLTRiNTctYmMyYi02ODU4ZGI3MjJmNTMiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9kOTU5Yjk3Zi05YzBiLTRmMjUtODczYi0yNzA0ODQ4NDE1MWEvIiwiaWF0IjoxNjcwNjE1NDI5LCJuYmYiOjE2NzA2MTU0MjksImV4cCI6MTY3MDYyMDE0MywiYWNyIjoiMSIsImFpbyI6IkFaUUFhLzhUQUFBQUsxS21CN3NCUkIrYVhPZmVlT0ltbGtJcEFCTEVHOXk1RldLOWpwQkFSUmExVENSSEhLU05Gd09nUWNPSENQRnFBOC9ZZlU4ZUpwSDhNWXFNVUNqN2czVFhsalVIZ0NOenZ1OGJuVmduaDJwSkJWWFN4ZWxDSDJaaEN0ZnJVamxCY3lEVmV3UEMycllxZEJRZTlNNmpBSjg5OEtVVDJnMTI0amFZL2tsc0dra2lldmFOSzVEWG1yRUNBZkRhaEtYbSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwaWQiOiI0NGM0YmU3YS0xNjJhLTRiNTctYmMyYi02ODU4ZGI3MjJmNTMiLCJhcHBpZGFjciI6IjAiLCJlbWFpbCI6IlhBLkNoZW5nQHN0dWRlbnQuaGFuLm5sIiwiZmFtaWx5X25hbWUiOiJDaGVuZyIsImdpdmVuX25hbWUiOiJBbGV4IiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNWQ3M2U3YjctYjNlMS00ZDAwLWIzMDMtMDU2MTQwYjJhM2I0LyIsImlwYWRkciI6IjgyLjE3MC4xMDQuMjMiLCJuYW1lIjoiQWxleCBDaGVuZyIsIm9pZCI6IjQ1YmQxN2IyLWMwY2MtNDc0ZC1iZGY5LWYzOGU0ZGE3ZmM1MyIsInJoIjoiMC5BUlVBZjdsWjJRdWNKVS1IT3ljRWhJUVZHbnEteEVRcUZsZEx2Q3RvV050eUwxTVZBQVUuIiwicm9sZXMiOlsiTXlBcHBBZG1pbmlzdHJhdG9yc0dyb3VwIl0sInNjcCI6ImFjY2VzcyIsInN1YiI6InZVdGxzTHVGWUY2ZWNuUGY4SS1HNm9PbFBxTVFHbzYzVTROdnJQZFJNaTQiLCJ0aWQiOiJkOTU5Yjk3Zi05YzBiLTRmMjUtODczYi0yNzA0ODQ4NDE1MWEiLCJ1bmlxdWVfbmFtZSI6IlhBLkNoZW5nQHN0dWRlbnQuaGFuLm5sIiwidXRpIjoiTmJFZWk2dkRiVTZ6d21ndUdRbHBBQSIsInZlciI6IjEuMCJ9.u9JG_EL9G2SvWl21iFDMA7UrP1Pt_hwVkQFr2k510P0ldkcXRPzJertheiLDleo7k_C8FB2pCfjGPbRnevMw3dxXlbfYcVZ67CZBZp8Dyc4H2AAfcFNRB-urHTyEfLmXBa8hQHhvp-6B0kwFsciuJ_g9kKuHSqixc8FG9zFodDAlKMYwkbE4tlxjGKfR7iHXtOKWEtl7BWGKudvvVgdN6Fh0hGeQBByWyu9mxFTrkfWAzDF594rOyc_yF8Pv0mHMnnLZne-QNVBen2s-MBX0LuCiZo97N8alEXsfvlum_jMqe7VbZHKglsBTadqA7Pag3eCwqd13uMP-s15SWnKsug";

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  console.log(config);

  return new Promise((resolve, reject) => {
    axios
      .get("https://localhost:7267/listings", config)
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
      .get(`https://localhost:7267/listings/${id}`)
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
