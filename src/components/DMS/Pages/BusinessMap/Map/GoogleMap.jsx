import GoogleMapReact from "google-map-react";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import useSupercluster from "use-supercluster";
import { apiGetMapInfo } from "../../../API";
import Cluster from "../Cluster/Cluster";
import "../Cluster/Cluster.css";
import MapMarker from "../Mark/MapMarker";
import { GGMapStyles } from "./GoogleMapStyle";

const Marker = ({ children }) => children;
const GoogleMap = () => {
  const [map, setMap] = useState(null);
  const googleMapRef = useRef();
  const [center, setCenter] = useState({
    lat: 20.99633582896531,
    lng: 105.80243370865026,
  });
  const [zoom, setZoom] = useState(12);
  const [bounds, setBounds] = useState(null);
  const [points, setPoints] = useState([]);

  const handleMapChange = ({ center, zoom, bounds }) => {
    setCenter(center);
    setZoom(zoom);
    setBounds([bounds.nw.lng, bounds.se.lat, bounds.se.lng, bounds.nw.lat]);
  };

  const getdata = async () => {
    const data = _.first(await apiGetMapInfo());
    const fetchedPoints = data.map((crime) => ({
      type: "Feature",
      properties: {
        cluster: false,
        id: crime?.key,
      },
      geometry: {
        type: "Point",
        coordinates: crime?.latlong
          ?.split(",")
          ?.map((coor) => parseFloat(coor))
          .reverse(),
      },
    }));

    setPoints([...fetchedPoints]);
  };

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  useEffect(() => {
    getdata();
    return () => {};
  }, []);

  return (
    <GoogleMapReact
      bootstrapURLKeys={{
        key: process.env.REACT_APP_API_GOOGLE_KEY,
      }}
      onGoogleApiLoaded={({ map }) => {
        googleMapRef.current = map;
      }}
      center={center}
      zoom={zoom}
      yesIWantToUseGoogleMapApiInternals
      onChange={handleMapChange}
      options={{ disableDefaultUI: true, styles: GGMapStyles }}
    >
      {clusters.map((cluster, index) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const {
          cluster: isCluster,
          point_count: pointCount,
          id,
        } = cluster.properties;
        if (isCluster) {
          return (
            <Marker lat={latitude} lng={longitude} key={`cluster-${index}`}>
              <Cluster
                onClick={() => {
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    20
                  );
                  googleMapRef.current.setZoom(expansionZoom);
                  googleMapRef.current.panTo({ lat: latitude, lng: longitude });
                }}
                style={{
                  width: `${7 + (pointCount / points.length) * 20}px`,
                  height: `${7 + (pointCount / points.length) * 20}px`,
                  background: "red",
                }}
                value={pointCount}
              />
            </Marker>
          );
        }

        return (
          <Marker key={`cluster-${index}`} lat={latitude} lng={longitude}>
            <MapMarker id={id} />
          </Marker>
        );
      })}
    </GoogleMapReact>
  );
};

export default GoogleMap;
