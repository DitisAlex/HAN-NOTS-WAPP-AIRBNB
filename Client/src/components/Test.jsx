import React, { useEffect, useState } from "react";
const axios = require("axios");

export default function Test(props) {
  const [Text] = useState("Hoiiii");

  useEffect(() => {
    console.log(Text);
    axios
      .get("https://localhost:7267/listings")
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      })
  });

  return <p>Hello World</p>;
}
