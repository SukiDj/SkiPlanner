import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores/store';
import { List, Button, Modal } from 'semantic-ui-react';
import { Restaurant } from '../../modules/Restaurant';
import RestaurantForm from '../CreatePage/Forms/RestaurantForm';

function RestaurantList() {
  const { restaurantStore, hotelStore,userStore } = useStore();
  const { getRestaurants, selectedRestaurant, setSelectedRestaurant, setRestaurantEditStarted, deleteRestaurant } = restaurantStore;
  const { setSelectedHotel } = hotelStore;
  const {isEmploye} = userStore;

const handleClick = (restaurant: Restaurant) => {
      setSelectedRestaurant(restaurant);
      setSelectedHotel(undefined);
    }
    const [formOpen, setFormOpen] = useState(false);

  const handleClose = () => {
    setFormOpen(false);
    setRestaurantEditStarted(false);
  };

  const handleEditClick = (restaurant: Restaurant) => {
      setSelectedRestaurant(restaurant);
      setFormOpen(true);
      setRestaurantEditStarted(true);
  };

  return (
    <>
      <List animated verticalAlign='middle'>
        {getRestaurants.length !== 0 && getRestaurants.map((restaurant, index) => (
          <List.Item key={restaurant.id || index} onClick={()=>handleClick(restaurant)} className="listItem">
           
            <List.Content>
              <List.Header as="a">{restaurant.naziv}</List.Header>
              <List.Description>{restaurant.tipKuhinje}</List.Description>
            </List.Content>
            {isEmploye &&
            <>
            <Button
                size="small"
                onClick={() => handleEditClick(restaurant)}
                content="Izmeni"
              />
              <Button
            size="small"
            color="red"
            content="Obrisi"
            onClick={() => deleteRestaurant(restaurant.id!)}
            />
            </>}
              
          </List.Item>
        ))}
      </List>

      {/* Modal koji se prikazuje u istoj komponenti */}
      <Modal
        open={formOpen}
        onClose={handleClose}
        size="large"
        dimmer="blurring"
      >
        <Modal.Content>
          {selectedRestaurant && (
            <RestaurantForm
              initialRestaurant={selectedRestaurant}
              onFormSubmit={(updatedRestaurant) => {
              restaurantStore.updateRestaurant(updatedRestaurant.id!, updatedRestaurant);
              setFormOpen(false)}
          }
            />
          )}
        </Modal.Content>
      </Modal>
    </>
  );
}

export default observer(RestaurantList);
