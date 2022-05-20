import React, { useEffect, useState } from "react";
const axios = require("axios");

export default function Test(props) {
  const [listings, setListings] = useState([]);
  const [listing, setListing] = useState([]);

  useEffect(() => {
    getListings();
    getListing(2818);
  }, []);

  const getListings = () => {
    axios
    .get("https://localhost:7267/listings")
    .then(function (response) {
        console.log(response.data)
      if (response.data) {
        setListings(response.data);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const getListing = (id) => {
    axios
    .get(`https://localhost:7267/listings/${id}`)
    .then(function (response) {
        console.log(response.data)
      if (response.data) {
        setListing(response.data);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
    <div>
      <p>Hello World</p>
      <ul>{listings.map((element) => {
         return <li key={element.id}>{element.name}</li>
      })}</ul>
      <hr/>
      <p>{listing.name}</p>
    </div>
  );
}
