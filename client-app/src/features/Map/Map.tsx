import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { useEffect } from 'react';
import { useStore } from '../../stores/store';
import { observer } from 'mobx-react-lite';

function MapComponent() {
  const { hotelStore, skiResortStore } = useStore();
  const { selectedHotel } = hotelStore;
  const { selectedResort } = skiResortStore;

  const centerLat = selectedResort ? selectedResort.lat : 44.284056;
  const centerLng = selectedResort ? selectedResort.lng : 20.810384;

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={8}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selectedResort && <MapUpdater lat={centerLat} lng={centerLng} />}
        {selectedHotel && (
          <Marker position={[selectedHotel.lat, selectedHotel.lng]}>
            <Popup>Ski centar Kopaonik</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

// Component to update the map center
function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], 16, { animate: true });
  }, [lat, lng, map]);

  return null;
}

export default observer(MapComponent);
