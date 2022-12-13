import { graphConfig } from "./authentication/authConfig";
const axios = require("axios");

/**
 * Fetch all listings and transform into geoJSON
 */
export async function getListingsGeo() {
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiI0NGM0YmU3YS0xNjJhLTRiNTctYmMyYi02ODU4ZGI3MjJmNTMiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vZDk1OWI5N2YtOWMwYi00ZjI1LTg3M2ItMjcwNDg0ODQxNTFhL3YyLjAiLCJpYXQiOjE2NzA5NDIzMTgsIm5iZiI6MTY3MDk0MjMxOCwiZXhwIjoxNjcwOTQ3NDU2LCJhaW8iOiJBWVFBZS84VEFBQUFFQVdxTkhGYnorY1BQelBBZmZwNG1yV2duVHdFL21kOERxVnhjai9QbzF1aGkyNW1GV0FhZDJpZE96bDNXVUd3c0NMT1BXdlhmb3RjNUN2RHdrTzFqQUxxdEF3bkVYc0xPT0dVaFQrRHpxK2RncHhzamNNU0lpY1k3Viswb2hHUHVUZUJSL1NweXJyMEdZdGd6VmdDU05WU1RSNGFDRUVFUHRjV0hUMTh2bDA9IiwiYXpwIjoiNDRjNGJlN2EtMTYyYS00YjU3LWJjMmItNjg1OGRiNzIyZjUzIiwiYXpwYWNyIjoiMCIsImlkcCI6ImxpdmUuY29tIiwibmFtZSI6IkFsZXggQ2hlbmciLCJvaWQiOiIyMjQzMzRmOC0wNzQzLTRkNjctOTZiNC01YzVkNmE2MDBlMDIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhbGV4Y2hlbmcwMzE0QGdtYWlsLmNvbSIsInJoIjoiMC5BUlVBZjdsWjJRdWNKVS1IT3ljRWhJUVZHbnEteEVRcUZsZEx2Q3RvV050eUwxTVZBTEEuIiwicm9sZXMiOlsiTXlBcHBVc2Vyc0dyb3VwIl0sInNjcCI6ImFjY2VzcyIsInN1YiI6IklmX2p3V294b3MzUFVKV3lOZEtUT1BkVXpQWkRfUmFaWklfOW1kMVF5ZmMiLCJ0aWQiOiJkOTU5Yjk3Zi05YzBiLTRmMjUtODczYi0yNzA0ODQ4NDE1MWEiLCJ1dGkiOiJSVFZOaGZRcTYwMndvS2t6UVR1aUFBIiwidmVyIjoiMi4wIn0.c-VvFJMyjJNVg0m92oXXUTHj6_AceX6qgHx189skp_47OM5mlyHlYCDT2elP-PqADqGcW1wbqOc4aya6_-RA5iktUwXU_NBOj8rAPLNAb-ZpNYfAUa5pbcdzJZfat6TNeDHe1AkoS9PXXAmiDMzWhtxNgmSD7hy2ZzZ863QZc3-dkFJPNOOv27vVEkcNSFR1EAJb2CuB0EATDAyrplUgVbGvJKWflK6MHsOFS7NoQclsX2V1_9_p4nVKdXLLhoeFRgZLGi2kxsuvFGqJj1tQtR3vjnIGqXzpSbIpWqGLco286vJYcQINdU0mIVw_QiLoYWp_cLPCMVWheI3RVm9GhQ";

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

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
