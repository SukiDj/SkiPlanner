import { observer } from 'mobx-react-lite'
import { Card, Icon, Image, Rating } from 'semantic-ui-react';
import { useStore } from '../../stores/store';

function CardWithRestaurantInfo() {

    const {restaurantStore} = useStore();
    const {selectedRestaurant} = restaurantStore;
  return (
    <div className="card-container">
        <Card>
            <Card.Content>
              <Card.Header style={{ fontSize: "25px" }}>{selectedRestaurant!.naziv}</Card.Header>
              <Card.Meta>
                <span className="date" style={{ fontSize: "15px" }}>Prosecna cena: {selectedRestaurant!.prosecnaCena} din</span>
              </Card.Meta>
              <Card.Description style={{ fontSize: "18px" }}>
                Tip kuhinje: {selectedRestaurant!.tipKuhinje}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <a>
              <Rating rating={Math.round(selectedRestaurant!.ocena * 2) / 2} maxRating={5} disabled/>
              </a>
            </Card.Content>
          </Card>
    </div>
  )
}
export default observer(CardWithRestaurantInfo);