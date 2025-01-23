import { observer } from "mobx-react-lite";
import L from "leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
interface MapComponentProps {
    onLocationSelect: (lat: number, lng: number) => void;
  }

function MapEditControl({ onLocationSelect }: MapComponentProps) {

    const handleCreated = (e: any) => {
        const layer = e.layer;
    
        // Use L.Marker to ensure TypeScript recognizes the layer
        if (layer instanceof L.Marker) {
          const latLng = layer.getLatLng();
          onLocationSelect(latLng.lat, latLng.lng);
        } else {
          console.warn("Unsupported layer type");
        }
      };

  return (
    <EditControl
      position="topright"
      onCreated={handleCreated}
      draw={{
        marker: true,
        circle: false,
        polygon: false,
        polyline: false,
        rectangle: false,
        circlemarker: false
      }}
    />
  );
  
}
export default observer(MapEditControl)