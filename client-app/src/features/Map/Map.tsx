import { FeatureGroup, MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { useEffect } from 'react';
import { useStore } from '../../stores/store';
import { observer } from 'mobx-react-lite';
import CardWithInfo from '../CardWithInfo/CardWithInfo';
import MapEditControl from './MapEditControl';

interface MapComponentProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

function MapComponent({ onLocationSelect }: MapComponentProps) {
  const { hotelStore, skiResortStore, mapStore:{ isCreating} } = useStore();
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
          
          <>
          <Marker position={[selectedHotel.lat, selectedHotel.lng]} />
            
          <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: 1000 }}>
            <CardWithInfo/>
          </div>
            
          </>
        )}
        {isCreating && 
        <FeatureGroup>
        <MapEditControl onLocationSelect={onLocationSelect} />
      </FeatureGroup>
        }
        
        
        
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
