import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for missing marker icon issue in Leaflet
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

const MapComponent = () => {
  const [latitude, setLatitude] = useState(28.6139); // Default: New Delhi
  const [longitude, setLongitude] = useState(77.209);
  const [locationName, setLocationName] = useState("New Delhi, India");
  const [radius, setRadius] = useState(1000); // Default radius: 1000 meters

  useEffect(() => {
    if (!isNaN(latitude) && !isNaN(longitude)) {
      fetchLocationName(latitude, longitude);
    }
  }, [latitude, longitude]);

  const fetchLocationName = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      if (data.display_name) {
        setLocationName(data.display_name);
      } else {
        setLocationName("Location not found");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setLocationName("Error fetching location");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Find a Location on Map</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="number"
          placeholder="Enter Latitude"
          value={latitude}
          onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="number"
          placeholder="Enter Longitude"
          value={longitude}
          onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="number"
          placeholder="Enter Radius (meters)"
          value={radius}
          onChange={(e) => setRadius(parseFloat(e.target.value) || 0)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
      </div>

      <h3>Location: {locationName}</h3>

      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
        key={`${latitude}-${longitude}-${radius}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <Marker position={[latitude, longitude]} icon={customIcon}>
          <Popup>{locationName}</Popup>
        </Marker>
        <Circle
          center={[latitude, longitude]}
          radius={radius}
          pathOptions={{ fillColor: "blue", color: "blue", fillOpacity: 0.3 }}
        />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
