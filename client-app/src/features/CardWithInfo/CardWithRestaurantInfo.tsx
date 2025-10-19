import { observer } from 'mobx-react-lite'
import { Card, Divider, Icon, Image, Rating } from 'semantic-ui-react';
import { useStore } from '../../stores/store';

function CardWithRestaurantInfo() {

    const {restaurantStore} = useStore();
    const {selectedRestaurant} = restaurantStore;
  return (
    <div
      className="card-container"
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
      }}
    >
      <Card
        raised
        color="orange"
        style={{
          width: "370px",
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        }}
      >
        <Card.Content textAlign="center">
          <Card.Header
            style={{ fontSize: "1.6em", marginBottom: "0.3em" }}
          >
            🍽️ {selectedRestaurant!.naziv}
          </Card.Header>

          <Divider />

          <Card.Description
            style={{
              textAlign: "left",
              fontSize: "1.45em",
              lineHeight: "1.7em",
            }}
          >
            <p>
              <Icon name="utensils" color="orange" />{" "}
              <strong>Tip kuhinje:</strong> {selectedRestaurant!.tipKuhinje}
            </p>
            <p>
              <Icon name="money bill alternate" color="green" />{" "}
              <strong>Prosečna cena:</strong>{" "}
              {selectedRestaurant!.prosecnaCena} din
            </p>
          </Card.Description>
        </Card.Content>

        <Card.Content extra textAlign="center">
          <Rating
            icon="star"
            rating={Math.round(selectedRestaurant!.ocena * 2) / 2}
            maxRating={5}
            disabled
            size="large"
          />
        </Card.Content>
      </Card>
    </div>
  )
}
export default observer(CardWithRestaurantInfo);