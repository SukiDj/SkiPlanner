import { Card, Divider, Icon, Image, Rating } from "semantic-ui-react";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";

function CardWithHotelInfo() {
  const {hotelStore} = useStore()
  const {selectedHotel} = hotelStore
  return (
    <div className="card-container" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      <Card raised color="teal" style={{ width: "380px", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>
        <Card.Content textAlign="center">
          <Card.Header style={{ fontSize: "1.6em", marginBottom: "0.3em" }}>
            🏨 {selectedHotel!.ime}
          </Card.Header>

          <Card.Meta style={{ color: "#666", marginBottom: "1em" }}>
            <Icon name="map marker alternate" color="teal" /> 
            Udaljenost od skijališta: <strong>{selectedHotel!.udaljenost} m</strong>
          </Card.Meta>

          <Divider />

          <Card.Description style={{ textAlign: "left", lineHeight: "1.8em", fontSize: "1.45em" }}>
            <p><Icon name="bed" color="blue" /> <strong>Dvokrevetna soba:</strong> {selectedHotel!.cenaDvokrevetneSobe} din</p>
            <p><Icon name="bed" color="teal" /> <strong>Trokrevetna soba:</strong> {selectedHotel!.cenaTrokrevetneSobe} din</p>
            <p><Icon name="bed" color="green" /> <strong>Četvorokrevetna soba:</strong> {selectedHotel!.cenaCetvorokrevetneSobe} din</p>
            <p><Icon name="bed" color="olive" /> <strong>Petokrevetna soba:</strong> {selectedHotel!.cenaPetokrevetneSobe} din</p>
          </Card.Description>
        </Card.Content>

        <Card.Content extra textAlign="center">
          <Rating
            icon="star"
            rating={Math.round(selectedHotel!.ocena * 2) / 2}
            maxRating={5}
            disabled
            size="large"
          />
        </Card.Content>
      </Card>
    </div>
    
  )
}
export default observer(CardWithHotelInfo);