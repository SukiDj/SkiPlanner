import { List } from "semantic-ui-react";
import { useStore } from "../../stores/store";
import './HotelList.css'
import { observer } from "mobx-react-lite";
import { Hotel } from "../../modules/Hotel";

function HotelList() {
    const {hotelStore, restaurantStore} = useStore();
    const {getHotels, setSelectedHotel} = hotelStore
    const {setSelectedRestaurant} = restaurantStore;
    const handleClick = (hotel: Hotel) => {
      setSelectedRestaurant(undefined);
      setSelectedHotel(hotel);
    }
  return (
    <List animated verticalAlign='middle'>
      {getHotels.length!==0 && getHotels?.map((hotel, index) => (
        <List.Item key={index} onClick={()=>handleClick(hotel)} className="listItem">
          <List.Content >
            <List.Header as="a">{hotel.ime}</List.Header>
            <List.Description>{hotel.udaljenost}</List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  )
}

export default observer(HotelList)
