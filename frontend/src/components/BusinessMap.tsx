import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Business } from "../types";

delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetina: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  icon: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadow: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MapProps {
  businesses: Business[];
  center?: [number, number];
}

export default function BusinessMap({ businesses, center = [20.5937, 78.9629] }: MapProps) {
  const defaultCenter: [number, number] = businesses.length > 0
    ? [businesses[0].latitude ?? center[0], businesses[0].longitude ?? center[1]] as [number, number]
    : center;

  return (
    <div className="win95-map">
      <MapContainer center={defaultCenter} zoom={10} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {businesses
          .filter((b) => b.latitude && b.longitude)
          .map((business) => (
            <Marker
              key={business.id}
              position={[business.latitude!, business.longitude!]}
              icon={L.icon({
                iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
              })}
            >
              <Popup>
                <strong>{business.name}</strong>
                <br />
                {business.address}
                <br />
                {business.city}, {business.state}
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
