import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "./css/Home.css";
import { getListingsGeo, getListing } from "../serverCommunications.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGl0aXNhbGV4IiwiYSI6ImNsNmYycmk5ejAwajMzaW82ZmFic2N0NHAifQ.GfrQsDiFIZLNdN1vweHTXQ";

export default function Home(props) {
  const [listingsGeo, setListingsGeo] = useState();
  const [selectedListingId, setSelectedListingId] = useState();
  const [currentListing, setCurrentListing] = useState();

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(4.89707);
  const [lat, setLat] = useState(52.377956);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v11",
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
    if (listingsGeo && listingsGeo.features.length) {
      console.log(listingsGeo);
      map.current.on("load", () => {
        if (!map.current.getSource("listings")) {
          map.current.addSource("listings", {
            type: "geojson",
            data: listingsGeo,
            cluster: true,
            clusterMaxZoom: 12, // Max zoom to cluster points on
            clusterRadius: 40, // Radius of each cluster when clustering points (defaults to 50)
          });
        }

        map.current.getSource("listings").setData(listingsGeo);

        map.current.addLayer({
          id: "clusters",
          type: "circle",
          source: "listings",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#51bbd6",
              100,
              "#f1f075",
              750,
              "#f28cb1",
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20,
              100,
              30,
              750,
              40,
            ],
          },
        });

        map.current.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "listings",
          filter: ["has", "point_count"],
          layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
        });

        map.current.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "listings",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#11b4da",
            "circle-radius": 4,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
          },
        });

        // inspect a cluster on click
        map.current.on("click", "clusters", (e) => {
          const features = map.current.queryRenderedFeatures(e.point, {
            layers: ["clusters"],
          });
          const clusterId = features[0].properties.cluster_id;
          map.current
            .getSource("listings")
            .getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return;

              map.current.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom,
              });
            });
        });

        // When a click event occurs on a feature in
        // the unclustered-point layer, open a popup at
        // the location of the feature, with
        // description HTML from its properties.
        map.current.on("click", "unclustered-point", (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const hostName = e.features[0].properties.hostName;
          const id = e.features[0].properties.id;
          const name = e.features[0].properties.name;
          const neighbourhood = e.features[0].properties.neighbourhood;
          const price = e.features[0].properties.price;
          const reviewScoresRating =
            e.features[0].properties.reviewScoresRating;

          // Ensure that if the map is zoomed out such that
          // multiple copies of the feature are visible, the
          // popup appears over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          setSelectedListingId(e.features[0].properties.id);
        });

        map.current.on("mouseenter", "clusters", () => {
          map.current.getCanvas().style.cursor = "pointer";
        });
        map.current.on("mouseleave", "clusters", () => {
          map.current.getCanvas().style.cursor = "";
        });
      });
    }
  }, [listingsGeo]);

  useEffect(() => {
    if (selectedListingId) {
      getListing(selectedListingId).then((response) => {
        console.log(response.data)
        setCurrentListing(response.data);
      });
    }
  }, [selectedListingId]);

  return (
    <div className="row">
      <div ref={mapContainer} className="col-7 map-container" />
      <div className="col">
        {currentListing && (
          <div>
            <h4>{currentListing.name}</h4>
            <p>Hosted by {currentListing.hostName} for {currentListing.price}</p>
            <div>
              <img
                src={currentListing.thumbnailUrl}
                alt={currentListing.name}
                className="rounded"
              />
            </div><hr/>
            <h5>Description:</h5>
            <p>{currentListing.summary}</p><hr/>
            <h5>Extra Information:</h5>
            <p>- {currentListing.bedrooms} bedrooms with {currentListing.beds} beds</p>
            <p>- Rated {currentListing.reviewScoresRating} out of 100</p>
            <p>- Neighbourhood: {currentListing.neighbourhoodCleansed}</p>
          </div>
        )}
      </div>
    </div>
  );
}
