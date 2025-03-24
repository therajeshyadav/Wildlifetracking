import React, { useState } from "react";

const LocationInput = ({ onLocationSubmit }) => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    if (!latitude || !longitude || !radius || !startDate || !endDate) {
      alert("Please enter valid latitude, longitude, radius, and dates!");
      return;
    }

    onLocationSubmit({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radius: parseFloat(radius),
      startDate,
      endDate,
    });

    // Clear input fields after submission
    setLatitude("");
    setLongitude("");
    setRadius("");
    setStartDate("");
    setEndDate("");
  };

  // const handleNDVICalculation = () => {
  //   alert("NDVI Calculation initiated for the selected area!");
  // };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-white">
      <h2 className="text-xl font-semibold mb-4">
        Choose Your Location & Date
      </h2>

      <div className="flex">
        <div className="m-4">
          <label className="block text-sm">Latitude</label>
          <input
            type="number"
            step="any"
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
            placeholder="Enter latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
        </div>

        <div className="m-4">
          <label className="block text-sm">Longitude</label>
          <input
            type="number"
            step="any"
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
            placeholder="Enter longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm">Radius (meters)</label>
        <input
          type="number"
          step="any"
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
          placeholder="Enter radius in meters"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
        />
      </div>

      <div className="flex">
        <div className="m-4">
          <label className="block text-sm">Start Date</label>
          <input
            type="date"
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="m-4">
          <label className="block text-sm">End Date</label>
          <input
            type="date"
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition"
      >
        Locate Area
      </button>

      {/* <button
        onClick={handleNDVICalculation}
        className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
      >
        Calculate Forest Loss
      </button> */}
    </div>
  );
};

export default LocationInput;
