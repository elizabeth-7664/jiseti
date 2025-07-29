// src/components/post/MapPicker.jsx
import React, { useCallback, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: -1.2921, // Nairobi default
  lng: 36.8219,
};

const libraries = ["places"];

const MapPicker = ({ onLocationSelect }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [marker, setMarker] = useState(null);

  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarker({ lat, lng });
    onLocationSelect({ lat, lng });
  }, [onLocationSelect]);

  if (loadError) return <p>Error loading map</p>;
  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="mt-4">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={defaultCenter}
        onClick={onMapClick}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
      {marker && (
        <div className="mt-2 text-sm text-gray-600">
          Selected Location: {marker.lat.toFixed(5)}, {marker.lng.toFixed(5)}
        </div>
      )}
    </div>
  );
};

export default MapPicker;
