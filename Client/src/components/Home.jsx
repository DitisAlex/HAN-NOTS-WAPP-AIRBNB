import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "./css/Home.css";
import {
  getListingsGeo,
  getListing,
  getNeighbourhoods,
} from "../serverCommunications.js";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGl0aXNhbGV4IiwiYSI6ImNsNmYycmk5ejAwajMzaW82ZmFic2N0NHAifQ.GfrQsDiFIZLNdN1vweHTXQ";

export default function Home(props) {
  const [listingsGeo, setListingsGeo] = useState();
  const [selectedListingId, setSelectedListingId] = useState();
  const [currentListing, setCurrentListing] = useState();
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [neighbourhoods, setNeighbourhoods] = useState();
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState("");
  const [minReviewScore, setMinReviewScore] = useState(1);
  const [maxReviewScore, setMaxReviewScore] = useState(100);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(4.89707);
  const [lat, setLat] = useState(52.377956);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v11?optimize=true",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  useEffect(() => {
    async function fetchNeighbourhoods() {
      let response = await getNeighbourhoods();
      setNeighbourhoods(response.data.allNeighbourhoods);
    }
    fetchNeighbourhoods();
  }, []);

  useEffect(() => {
    async function fetchListingsGeo() {
      let response = await getListingsGeo();
      setListingsGeo(response);
    }
    fetchListingsGeo();
  }, []);

  useEffect(() => {
    if (map.current.getSource("listings")) {
      map.current.getSource("listings").setData(listingsGeo);
    }
  }, [listingsGeo]);

  useEffect(() => {
    if (listingsGeo && listingsGeo.features.length) {
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
        map.current.on("click", "unclustered-point", (e) => {
          setSelectedListingId(e.features[0].properties.id);
        });
        map.current.on("mouseenter", "unclustered-point", () => {
          map.current.getCanvas().style.cursor = "pointer";
        });
        map.current.on("mouseenter", "clusters", () => {
          map.current.getCanvas().style.cursor = "pointer";
        });
        map.current.on("mouseleave", "clusters", () => {
          map.current.getCanvas().style.cursor = "";
        });
        map.current.on("mouseleave", "unclustered-point", () => {
          map.current.getCanvas().style.cursor = "";
        });
      });
    }
  }, [listingsGeo]);

  useEffect(() => {
    if (selectedListingId) {
      getListing(selectedListingId).then((response) => {
        setCurrentListing(response.data);
      });
    }
  }, [selectedListingId]);

  return (
    <div>
      <div className="row">
        <div ref={mapContainer} className="col-7 map-container" />
        <div className="col">
          {currentListing && (
            <div>
              <div className="row">
                <h4 className="col-md-10">{currentListing.name}</h4>
                <Button
                  className="col-md-1"
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSelectedListingId();
                    setCurrentListing();
                  }}
                >
                  X
                </Button>
              </div>

              <p>
                Hosted by {currentListing.hostName} for ${currentListing.price}
                /night.
              </p>
              <div>
                <img
                  src={currentListing.thumbnailUrl}
                  alt={currentListing.name}
                  className="rounded"
                />
              </div>
              <hr />
              <h5>Description:</h5>
              <p>{currentListing.summary}</p>
              <hr />
              <h5>Extra Information:</h5>
              <p>
                - {currentListing.bedrooms} bedrooms with {currentListing.beds}{" "}
                beds
              </p>
              {currentListing.reviewScoresRating ? (
                <p>- Rated {currentListing.reviewScoresRating} out of 100</p>
              ) : (
                ""
              )}
              <p>- Neighbourhood: {currentListing.neighbourhoodCleansed}</p>
              <p>- Minimum nights: {currentListing.minimumNights}</p>
              <p>- Maximum nights: {currentListing.maximumNights}</p>
            </div>
          )}
        </div>
      </div>
      <div className="row p-3">
        <div className="col">
          <h3>Price Filter:</h3>
          <Form.Label column sm="6">
            Minimum Price: ${minPrice}
          </Form.Label>
          <Form.Range
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min={1}
            max={5000}
          />
          <br />
          <Form.Label column sm="6">
            Maximum Price: ${maxPrice}
          </Form.Label>
          <Form.Range
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min={minPrice}
            max={5000}
          />
        </div>
        <div className="col">
          <h3>Neighbourhood Filter:</h3>
          <Form.Select
            value={selectedNeighbourhood}
            onChange={(e) => setSelectedNeighbourhood(e.target.value)}
          >
            <option value="">Select neighbourhood...</option>
            {neighbourhoods
              ? neighbourhoods.map((neighbourhood) => {
                  return (
                    <option value={neighbourhood.name} key={neighbourhood.name}>
                      {neighbourhood.name}
                    </option>
                  );
                })
              : ""}
          </Form.Select>
        </div>
        <div className="col">
          <h3>Review Score Filter:</h3>
          <Form.Label column sm="8">
            Minimum Review Score: {minReviewScore}/100
          </Form.Label>
          <Form.Range
            value={minReviewScore}
            onChange={(e) => setMinReviewScore(e.target.value)}
            min={1}
            max={99}
          />
          <br />
          <Form.Label column sm="8">
            Maximum Review Score: {maxReviewScore}/100
          </Form.Label>
          <Form.Range
            value={maxReviewScore}
            onChange={(e) => setMaxReviewScore(e.target.value)}
            min={minReviewScore}
            max={100}
          />
        </div>
        <div className="col">
          <Button
            variant="primary"
            className="m-2"
            onClick={(e) => {
              let params = {};
              if (minPrice != 1) {
                params.PriceFrom = minPrice;
              }
              if (maxPrice != 5000) {
                params.PriceTo = maxPrice;
              }
              if (selectedNeighbourhood) {
                params.Neighbourhood = selectedNeighbourhood;
              }
              if (minReviewScore != 1) {
                params.ReviewsFrom = minReviewScore;
              }
              if (maxReviewScore != 100) {
                params.ReviewsTo = maxReviewScore;
              }
              if (params && Object.keys(params).length) {
                async function fetchListingsGeo(params) {
                  let response = await getListingsGeo(params);
                  setListingsGeo(response);
                }
                fetchListingsGeo(params);
              }
            }}
          >
            Apply Filters
          </Button>
          <Button
            variant="danger"
            className="m-2"
            onClick={() => {
              setMinPrice(1);
              setMaxPrice(5000);
              setSelectedNeighbourhood("");
              setMinReviewScore(1);
              setMaxReviewScore(100);
              async function fetchListingsGeo() {
                let response = await getListingsGeo();
                setListingsGeo(response);
              }
              fetchListingsGeo();
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
