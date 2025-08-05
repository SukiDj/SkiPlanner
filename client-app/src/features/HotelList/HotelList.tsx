import { Button, List, Modal } from "semantic-ui-react";
import { useStore } from "../../stores/store";
import './HotelList.css'
import { observer } from "mobx-react-lite";
import { Hotel } from "../../modules/Hotel";
import { useState } from "react";
import HotelForm from "../CreatePage/Forms/HotelForm";

function HotelList() {
    const {hotelStore, restaurantStore} = useStore();
    const {getHotels, setSelectedHotel, selectedHotel, setEditStarted, deleteHotel} = hotelStore
    const {setSelectedRestaurant} = restaurantStore;
    const handleClick = (hotel: Hotel) => {
      setSelectedRestaurant(undefined);
      setSelectedHotel(hotel);
    }
    const [formOpen, setFormOpen] = useState(false);
    const handleEditClick = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setFormOpen(true);
    setEditStarted(true);
};

    const handleClose = () => {
    setFormOpen(false);
    setEditStarted(false);
  };

  return (
    <>
    <List animated verticalAlign='middle'>
      {getHotels.length!==0 && getHotels?.map((hotel, index) => (
        <List.Item key={index} onClick={()=>handleClick(hotel)} className="listItem">
          <List.Content >
            <List.Header as="a">{hotel.ime}</List.Header>
            <List.Description>{hotel.udaljenost}</List.Description>
          </List.Content>
          <Button onClick={() => handleEditClick(hotel)}>
            Izmeni Hotel
          </Button>
          <Button
            size="small"
            color="red"
            content="Obrisi"
            onClick={() => deleteHotel(hotel.id!)}
            />
        </List.Item>
      ))}
      <Modal
  onClose={handleClose}
  onOpen={() => setFormOpen(true)}
  open={formOpen}
  size="large"
  dimmer="blurring"
>
  <Modal.Header>Izmeni Hotel</Modal.Header>
  <Modal.Content>
    {selectedHotel && (
      <HotelForm
        initialHotel={selectedHotel}
        onFormSubmit={(updatedHotel) => {
          
          hotelStore.updateHotel(updatedHotel.id!, updatedHotel);
          setFormOpen(false);
        }}
      />
    )}
  </Modal.Content>
</Modal>
    </List>
    </>
  )
}

export default observer(HotelList)
