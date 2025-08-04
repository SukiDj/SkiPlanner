import { observer } from "mobx-react-lite";
import L from "leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { useStore } from "../../stores/store";
interface MapComponentProps {
    onLocationSelect: (lat: number, lng: number) => void;
  }

function MapEditControl({ onLocationSelect }: MapComponentProps) {
const {hotelStore, restaurantStore, skiResortStore } = useStore();

    const {setSelectedHotelLatLng, selectedHotel} = hotelStore;
    const {setSelectedRestaurantLatLng, selectedRestaurant} = restaurantStore;
    const {isSkyResortEditing, setSelectedSkiResortLatLng} = skiResortStore;

    const handleCreated = (e: any) => {
        const layer = e.layer;
        
        if (layer instanceof L.Marker) {
          const latLng = layer.getLatLng();
          onLocationSelect(latLng.lat, latLng.lng);
        } else {
          console.warn("Unsupported layer type");
        }
      };

       const onEdited = (e: any) => {
        e.layers.eachLayer((layer: any) => {
        const { lat, lng } = layer.getLatLng();
        onLocationSelect(lat, lng);
        if(isSkyResortEditing)
          setSelectedSkiResortLatLng(lat,lng);
        if(selectedHotel !== undefined)
          setSelectedHotelLatLng(lat, lng);
        else if(selectedRestaurant !== undefined)
          setSelectedRestaurantLatLng(lat, lng)
    });
  };

  return (
    <EditControl
      position="topright"
      onCreated={handleCreated}
      onEdited={onEdited}
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