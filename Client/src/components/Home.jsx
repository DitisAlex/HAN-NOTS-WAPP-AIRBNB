import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "./css/Home.css";
import { getListingsGeo } from "../serverCommunications.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGl0aXNhbGV4IiwiYSI6ImNsNmYycmk5ejAwajMzaW82ZmFic2N0NHAifQ.GfrQsDiFIZLNdN1vweHTXQ";

export default function Home(props) {
  const [listingsGeo, setListingsGeo] = useState();

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(4.89707);
  const [lat, setLat] = useState(52.377956);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  useEffect(() => {
    async function fetchListingsGeo() {
      let response = await getListingsGeo();
      setListingsGeo(response);
    }
    fetchListingsGeo();
  }, []);

  useEffect(() => {
    console.log(listingsGeo);
    if (listingsGeo && listingsGeo.features.length) {
      map.current.on("load", () => {
        map.current.addSource("listings", {
          type: "geojson",
          data: listingsGeo,
        });

        map.current.addLayer({
          id: "listings-circle",
          type: "circle",
          source: "listings",
          class: "marker",
        });
      });

      map.current.on("move", () => {
        setLng(map.current.getCenter().lng.toFixed(4.9));
        setLat(map.current.getCenter().lat.toFixed(52.4));
        setZoom(map.current.getZoom().toFixed(2));
      });
    }
  }, [listingsGeo]);

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
