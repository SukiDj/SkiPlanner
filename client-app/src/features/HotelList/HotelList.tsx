import { List } from "semantic-ui-react";
import { useStore } from "../../stores/store";
import './HotelList.css'
import { observer } from "mobx-react-lite";

function HotelList() {
    const {hotelStore} = useStore();
    const {getHotels, setSelectedHotel} = hotelStore
  return (
    <List animated verticalAlign='middle'>
      {getHotels.length!==0 && getHotels?.map((hotel, index) => (
        <List.Item key={index} onClick={()=>setSelectedHotel(hotel)} className="listItem">
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
