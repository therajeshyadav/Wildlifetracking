import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LocationInput from "./LocationInput";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const AnimatedMapMove = ({ latitude, longitude }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([latitude, longitude], 12, { duration: 2 });
  }, [latitude, longitude, map]);
  return null;
};

const DeforestationMap = () => {
  const [latitude, setLatitude] = useState(28.6139);
  const [longitude, setLongitude] = useState(77.209);
  const [radius, setRadius] = useState(5000);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deforestationData, setDeforestationData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!startDate || !endDate) return;
    setLoading(true);

    fetch(
      `https://your-api.com/deforestation?lat=${latitude}&lng=${longitude}&radius=${radius}&start=${startDate}&end=${endDate}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDeforestationData(data);
        } else {
          console.error("Invalid data format");
          setDeforestationData([]);
        }
      })
      .catch((err) => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
  }, [latitude, longitude, radius, startDate, endDate]);

  const getColorByIntensity = (intensity) => {
    if (intensity > 7) return "darkred";
    if (intensity > 4) return "red";
    return "orange";
  };

  const handleLocationSubmit = ({
    latitude,
    longitude,
    radius,
    startDate,
    endDate,
  }) => {
    setLatitude(latitude);
    setLongitude(longitude);
    setRadius(radius);
    setStartDate(startDate);
    setEndDate(endDate);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-xl font-bold text-white mb-4">
        Real-Time Deforestation Map
      </h2>
      <div className="flex flex-row justify-between items-start space-x-6 w-full">
        <div className="w-1/3">
          <LocationInput onLocationSubmit={handleLocationSubmit} />
        </div>
        <div className="w-2/3">
          {loading && <p className="text-gray-500">Loading data...</p>}
          <MapContainer
            center={[latitude, longitude]}
            zoom={6}
            style={{ height: "500px", width: "100%" }}
            className="rounded-lg shadow-md"
          >
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="© OpenStreetMap contributors & Map Providers"
            />
            <AnimatedMapMove latitude={latitude} longitude={longitude} />
            <Marker position={[latitude, longitude]} icon={customIcon}>
              <Popup>Selected Location</Popup>
            </Marker>
            <Circle
              center={[latitude, longitude]}
              radius={radius}
              color="blue"
              fillColor="lightblue"
              fillOpacity={0.4}
            >
              <Popup>
                <b>Search Radius:</b> {radius} meters
              </Popup>
            </Circle>
            {deforestationData.map((point, index) => (
              <Circle
                key={index}
                center={[point.lat, point.lng]}
                radius={point.intensity * 1000}
                color={getColorByIntensity(point.intensity)}
                fillColor={getColorByIntensity(point.intensity)}
                fillOpacity={0.5}
              >
                <Popup>
                  <b>Deforestation Alert!</b>
                  <br /> Intensity: {point.intensity}
                  <br /> Date: {point.date}
                </Popup>
              </Circle>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default DeforestationMap;
