import { List } from "semantic-ui-react";
import { useStore } from "../../stores/store";
import './HotelList.css'

export default function HotelList() {
    const {hotelStore} = useStore();
    const {hotels, setSelectedHotel} = hotelStore
  return (
    <List animated verticalAlign='middle'>
      {hotels.map((hotel, index) => (
        <List.Item key={index} onClick={()=>setSelectedHotel(hotel)} className="listItem">
          <List.Content >
            <List.Header as="a">{hotel.name}</List.Header>
            <List.Description>{hotel.description}</List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  )
}
