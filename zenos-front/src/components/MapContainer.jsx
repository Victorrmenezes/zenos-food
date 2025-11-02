import React from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapContainer.css';

// Fix Leaflet's default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const center = {
  lat: -22.9068,
  lng: -43.1729,
};

const markers = [
  { lat: -22.9519, lng: -43.2105, price: 'R$500' },
  { lat: -22.9083, lng: -43.1964, price: 'R$818' },
  { lat: -22.9876, lng: -43.2075, price: 'R$615' },
  { lat: -22.9707, lng: -43.1824, price: 'R$884' },
];

// Custom price marker icon
const createPriceIcon = (price) => {
  return L.divIcon({
    className: 'custom-price-marker',
    html: `<div class="price-marker">${price}</div>`,
  });
};

function MapContainer() {
  return (
    <div className="map-container">
        <img src="https://picsum.photos/500/500" alt="Map Placeholder" className="map-placeholder" />
      {/* <LeafletMap
        center={[center.lat, center.lng]}
        zoom={12}
        style={{ height: '500px', width: '100%', borderRadius: '16px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((marker, idx) => (
          <Marker
            key={idx}
            position={[marker.lat, marker.lng]}
            icon={createPriceIcon(marker.price)}
          >
            <Popup>{marker.price}</Popup>
          </Marker>
        ))}
      </LeafletMap> */}
    </div>
  );
}

export default MapContainer;
