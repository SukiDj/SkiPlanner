import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores/store';
import { List } from 'semantic-ui-react';
import { Restaurant } from '../../modules/Restaurant';

function RestaurantList() {
    const {restaurantStore, hotelStore} = useStore();
    const {getRestaurants, setSelectedRestaurant} = restaurantStore;
    const {setSelectedHotel} = hotelStore;
    const handleClick = (restaurant: Restaurant) => {
      setSelectedHotel(undefined);
      setSelectedRestaurant(restaurant);
    }
  return (
    <List animated verticalAlign='middle'>
      {getRestaurants.length!==0 && getRestaurants?.map((restaurant, index) => (
        <List.Item key={index} onClick={()=>handleClick(restaurant)} className="listItem">
          <List.Content >
            <List.Header as="a">{restaurant.naziv}</List.Header>
            <List.Description>{restaurant.tipKuhinje}</List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  )
}

export default observer(RestaurantList)