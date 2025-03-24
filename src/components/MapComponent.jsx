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
  const [error, setError] = useState("");

  useEffect(() => {
    if (!startDate || !endDate) return;
    setLoading(true);
    setError("");

    fetch(
      `https://your-api.com/deforestation?lat=${latitude}&lng=${longitude}&radius=${radius}&start=${startDate}&end=${endDate}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setDeforestationData(data);
        } else {
          setError("Invalid data format received.");
          setDeforestationData([]);
        }
      })
      .catch((err) => {
        setError(err.message || "Error fetching data.");
        setDeforestationData([]);
      })
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

  const handleNDVICalculation = () => {
    alert("NDVI Calculation initiated for the selected area!");
    // You can add actual NDVI calculation logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#020024] via-[#6868cc] to-[#00d4ff] flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-bold text-white mb-4">
        Real-Time Deforestation Map
      </h2>

      <div className="flex w-full h-[90vh] space-x-6">
        {/* Left Panel - Location Input */}
        <div className="w-1/3 bg-gray-900 p-6 rounded-lg shadow-lg text-white flex flex-col justify-between h-full">
          <LocationInput onLocationSubmit={handleLocationSubmit} />
          <button
            onClick={handleNDVICalculation}
            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
          >
            Calculate Forest Loss
          </button>
        </div>

        {/* Right Panel - Map */}
        <div className="w-2/3">
          {loading && (
            <p className="text-gray-500 text-center">Loading data...</p>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {!loading && !error && deforestationData.length === 0 && (
            <p className="text-yellow-500 text-center">
              No deforestation data found for this area.
            </p>
          )}

          <MapContainer
            center={[latitude, longitude]}
            zoom={6}
            style={{ height: "100%", width: "100%" }}
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
