// Upload.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import api from "../api/api";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationPicker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMobile(isMobileDevice());

    const token = localStorage.getItem("token");
    if (!token) {
      alert("🚫 You must be logged in to upload.");
      navigate("/register");
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setIsFetchingLocation(true);

      navigator.geolocation?.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsFetchingLocation(false);
        },
        (err) => {
          console.error("Geolocation error:", err.message);
          setShowMap(true);
          setIsFetchingLocation(false);
          alert("⚠️ Could not fetch location. Try manually on map.");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !location) {
      alert("❗ Please select an image and location.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("location", JSON.stringify(location));
    formData.append("postedBy", user._id); // ✅ Use _id of user and match field name

    try {
      const token = localStorage.getItem("token");
      await api.post("/posts/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Post uploaded successfully!");
      navigate("/discover");
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Upload failed. Try again.");
    }
  };


  return (
    <div className="min-h-screen w-[100vw] flex flex-col items-center pt-24 bg-green-50 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-green-800 mx-5 mb-6">
        Upload Waste Spot & Mark Its Location 🌍
      </h1>

      <div className="bg-white w-[100%] md:w-[80%] p-6 rounded-lg shadow-md mx-auto space-y-4">
        {/* Upload Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row justify-center">
          {isMobile && (
            <label className="bg-green-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-green-700">
              Upload From Camera
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}

          <label className="bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-700">
            Upload From Gallery
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mx-auto mt-4 rounded-md max-h-64"
          />
        )}

        {isFetchingLocation && (
          <p className="text-sm text-gray-600">📡 Fetching your location...</p>
        )}

        {showMap || location ? (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-2">
              Click on map to choose the correct location of the waste spot:
            </h3>
            <MapContainer
              center={location || [28.6139, 77.209]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationPicker onSelect={(latlng) => setLocation(latlng)} />
              {location && <Marker position={location} />}
            </MapContainer>
            {location && (
              <p className="mt-2 text-green-700">
                Final Location: Lat {location.lat.toFixed(4)}, Lng {location.lng.toFixed(4)}
              </p>
            )}
          </div>
        ) : null}

        <button
          onClick={handleSubmit}
          className="mt-6 bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
