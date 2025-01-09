import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { useStore } from '../../stores/store';
import { observer } from 'mobx-react-lite';

function Map() {
  const {hotelStore} = useStore()
  const {selectedHotel} = hotelStore 
  return (
    <div style={{ height: "80vh", width: "100%" }}> {/* Add a wrapper div with styles */}
      <MapContainer
        center={[43.284056, 20.810384]}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }} // Set height and width for the map
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selectedHotel && <Marker position={[selectedHotel.lat, selectedHotel.lng]}>
          <Popup>
            Ski centar Kopaonik
          </Popup>
        </Marker>}
      </MapContainer>
    </div>
  );
}

export default observer(Map);