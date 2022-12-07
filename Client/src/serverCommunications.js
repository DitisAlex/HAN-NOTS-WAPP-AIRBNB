import { graphConfig } from "./authentication/authConfig";
const axios = require("axios");

/**
 * Fetch all listings and transform into geoJSON
 */
export async function getListingsGeo() {
  const accessToken =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiIzYjI0Yzk1OS0xNDFjLTRkNjUtYWM5OS05NmI0MWMzM2Y0MzgiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vZDk1OWI5N2YtOWMwYi00ZjI1LTg3M2ItMjcwNDg0ODQxNTFhL3YyLjAiLCJpYXQiOjE2NzA0NDQyOTAsIm5iZiI6MTY3MDQ0NDI5MCwiZXhwIjoxNjcwNDQ4NTE3LCJhaW8iOiJBWFFBaS84VEFBQUEyNGVDZ0o5Z2dTVVJZK0VXQVEybTZXWmU4Tk1DNm5DR3M5RlRJck9jMHArSHkwUWNRa3QraGJvQ0ZyaXFkZW5kSmlHNUREalhYZTFHUi9lcmdld0pNcUIzSkxndTZMV2kxRTR0bHluUTcvb09peGFwYmlpZCs4cGZmU2xJRkI1eWRvcWZTd1drbVJOc0VxVU4zb1JVZ3c9PSIsImF6cCI6IjNiMjRjOTU5LTE0MWMtNGQ2NS1hYzk5LTk2YjQxYzMzZjQzOCIsImF6cGFjciI6IjAiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC81ZDczZTdiNy1iM2UxLTRkMDAtYjMwMy0wNTYxNDBiMmEzYjQvIiwibmFtZSI6IkFsZXggQ2hlbmciLCJvaWQiOiI0NWJkMTdiMi1jMGNjLTQ3NGQtYmRmOS1mMzhlNGRhN2ZjNTMiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJYQS5DaGVuZ0BzdHVkZW50Lmhhbi5ubCIsInJoIjoiMC5BUlVBZjdsWjJRdWNKVS1IT3ljRWhJUVZHbG5KSkRzY0ZHVk5ySm1XdEJ3ejlEZ1ZBQVUuIiwic2NwIjoibG9naW5fdXNlciIsInN1YiI6ImZBcHNSZFlUcWk1NFBZT28yelBOMDV4bV9jUUEzaVpIQ25JSVdRcExLdWsiLCJ0aWQiOiJkOTU5Yjk3Zi05YzBiLTRmMjUtODczYi0yNzA0ODQ4NDE1MWEiLCJ1dGkiOiJKdUxfVHFScmNVZUZlbGxfSkZrMkFBIiwidmVyIjoiMi4wIn0.qL8kP6bRKrmBUl7KwPMNh7K80Zq-C37RhEo5CtViWJoC9Coxqui2HE5XVHdudoEZsJDLqwATtOTctOAb5KDW8NSOF_zpzlkIaob-32UYtbo4mlmMNyTqyjtLNnWQRYngtEhONEZxSbKpoiWOY8f2JkvuCx2qGvKC4U1wdMas2Z2OYksyk1Ft7KN_e-S9b62hXDGZECt097cWb_6LMgDSUxhC6GE9zcPDj1NmlGjeMb52JyJVTLvIzBUaJ-Y1T3tENBJ_fkimCuNm3p0FHF33-nPL0VzM0eEYtlheRs94YBpb5Ldid30IMN3Atr60TPuaaDnuX_EpqkTvrJKL_HGe7g";
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  console.log(headers);

  return new Promise((resolve, reject) => {
    axios
      .get("https://localhost:7267/listings", headers)
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
