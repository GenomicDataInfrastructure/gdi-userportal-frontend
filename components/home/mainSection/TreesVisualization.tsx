import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { request, RequestDocument, Variables } from "graphql-request";
import getConfig from "next/config";
import Script from "next/script";
import useSWR from "swr";

const fetcher = (query: RequestDocument | TypedDocumentNode<any, Variables>) =>
  request("https://gql.datopian.com/v1/graphql", query);

export default function TreesVisualization() {
  const query = `
  query BelfastTrees {
    belfast_trees {
      LATITUDE
      LONGITUDE
      SPECIES
    }
  }
`;

  const { data, error } = useSWR(query, fetcher);
  if (error) {
    return <span>There was an error fetching the data</span>;
  }
  function CreateChart() {
    if (typeof window !== "undefined" && window.google && data) {
      const drawChart = () => {
        const data = google.visualization.arrayToDataTable(dataTable);

        const map = new google.visualization.Map(
          document.getElementById("map_div")
        );
        map.draw(data, {
          showTooltip: true,
          showInfoWindow: true,
        });
      };
      const google = window.google;
      google.charts.load("current", {
        packages: ["map"],
        mapsApiKey: getConfig().serverRuntimeConfig.GOOGLE_MAPS_KEY,
      });
      google.charts.setOnLoadCallback(drawChart);
      const trees = data.belfast_trees.map(
        (tree: { LATITUDE: number; LONGITUDE: number; SPECIES: string }) => [
          tree.LATITUDE,
          tree.LONGITUDE,
          tree.SPECIES,
        ]
      );
      const dataTable = [["Lat", "Long", "Name"]].concat(trees);
    }
    return null;
  }

  return (
    <>
      <Script src="https://www.gstatic.com/charts/loader.js"></Script>
      <CreateChart />
      <div id="map_div" style={{ width: "100%", height: "400px" }}>
        <div className="pt-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 animate-spin m-auto"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
