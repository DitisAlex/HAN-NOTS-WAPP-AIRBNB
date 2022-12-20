import React, { useEffect, useState } from "react";
import { getStats } from "../serverCommunications";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
  useAccount,
} from "@azure/msal-react";
import { loginRequest } from "../authentication/authConfig";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

export default function Charts(props) {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [stats, setStats] = useState({});
  const [totalListingsData, setTotalListingsData] = useState();
  const [reviewScoreData, setReviewScoreData] = useState();
  const [availabilityData, setAvailabilityData] = useState();
  const [propertyData, setPropertyData] = useState();
  const [totalData, setTotalData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const graphOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  useEffect(() => {
    const request = {
      ...loginRequest,
      account: accounts[0],
    };
    if (account) {
      instance.acquireTokenSilent(request).then((response) => {
        getStats(response.accessToken).then((response) => {
          setStats(response.data);
        });
      });
    }
  }, [account, instance]);

  useEffect(() => {
    if (stats && stats.listingsPerNeighbourhood && stats.listingsPerProperty) {
      const labels = stats.listingsPerNeighbourhood.map((item) => {
        return item.neighbourhood;
      });

      let listingData = {
        labels: labels,
        datasets: [
          {
            label: "Total Listings per Neighbourhood",
            data: stats.listingsPerNeighbourhood.map((item) => {
              return item.totalListings;
            }),
            fill: true,
            borderColor: "#0074D9",
            tension: 0.3,
          },
        ],
      };

      setTotalListingsData(listingData);

      let reviewScoreData = {
        labels: labels,
        datasets: [
          {
            label: "Average Review Score / 100 per Neighbourhood",
            data: stats.listingsPerNeighbourhood.map((item) => {
              return item.averageReviewScore;
            }),
            fill: true,
            borderColor: "#0074D9",
            tension: 0.3,
          },
        ],
      };

      setReviewScoreData(reviewScoreData);

      let availabilityData = {
        labels: labels,
        datasets: [
          {
            label: "Availability past 30 days",
            data: stats.listingsPerNeighbourhood.map((item) => {
              return item.averageAvailability30;
            }),
            fill: true,
            borderColor: "#EBE534",
            tension: 0.3,
          },
          {
            label: "Availability past 60 days",
            data: stats.listingsPerNeighbourhood.map((item) => {
              return item.averageAvailability60;
            }),
            fill: true,
            borderColor: "#EB4034",
            tension: 0.3,
          },
          {
            label: "Availability past 90 days",
            data: stats.listingsPerNeighbourhood.map((item) => {
              return item.averageAvailability90;
            }),
            fill: true,
            borderColor: "#34EB77",
            tension: 0.3,
          },
          {
            label: "Availability past 365 days",
            data: stats.listingsPerNeighbourhood.map((item) => {
              return item.averageAvailability365;
            }),
            fill: true,
            borderColor: "#0074D9",
            tension: 0.3,
          },
        ],
      };

      setAvailabilityData(availabilityData);

      let propertyData = {
        labels: stats.listingsPerProperty.map((item) => {
          return item.type;
        }),
        datasets: [
          {
            label: "Property amount",
            data: stats.listingsPerProperty.map((item) => {
              return item.count;
            }),
            fill: true,
            backgroundColor: [
              "#0074D9",
              "#FF4136",
              "#2ECC40",
              "#FF851B",
              "#7FDBFF",
              "#B10DC9",
              "#FFDC00",
              "#001f3f",
              "#39CCCC",
            ],
          },
        ],
      };

      setPropertyData(propertyData);

      let totalData = {
        labels: ["Amount"],
        datasets: [
          {
            label: "Currently Available",
            data: [stats.totalAvailable],
            fill: true,
            backgroundColor: "#0074D9",
          },
          {
            label: "Currently Unavailable",
            data: [4512],
            fill: true,
            backgroundColor: "#FC0808",
          },
        ],
      };

      setTotalData(totalData);

      setIsLoading(false);
    }
  }, [stats]);

  return (
    <div>
      <AuthenticatedTemplate>
        {account &&
        account.idTokenClaims.roles[0] == "MyAppAdministratorsGroup" ? (
          <div>
            {isLoading ? (
              "Fetching Graph Data..."
            ) : (
              <div>
                <div class="row justify-content-md-center">
                  <div class="col-5">
                    <Line options={graphOptions} data={totalListingsData} />
                  </div>
                  <div class="col-5">
                    <Line options={graphOptions} data={reviewScoreData} />
                  </div>
                </div>
                <div class="row">
                  <div class="col-5">
                    <Line options={graphOptions} data={availabilityData} />
                  </div>
                  <div class="col-3">
                    <Pie options={graphOptions} data={propertyData} />
                  </div>
                  <div class="col-3">
                    <Bar options={graphOptions} data={totalData} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="container">
            You do not have enough permissions to view this page!
          </div>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <div className="container">
          You must be signed before you can view this page!
        </div>
      </UnauthenticatedTemplate>
    </div>
  );
}
