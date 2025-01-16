import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores/store';
import { List } from 'semantic-ui-react';

function RestaurantList() {
    const {restaurantStore} = useStore();
    const {getRestaurants, setSelectedRestaurant} = restaurantStore;
  return (
    <List animated verticalAlign='middle'>
      {getRestaurants.length!==0 && getRestaurants?.map((restaurant, index) => (
        <List.Item key={index} onClick={()=>setSelectedRestaurant(restaurant)} className="listItem">
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