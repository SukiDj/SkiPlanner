import { Card, Icon, Image, Rating } from "semantic-ui-react";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";

function CardWithHotelInfo() {
  const {hotelStore} = useStore()
  const {selectedHotel} = hotelStore
  return (
    <div className="card-container">
        <Card style={{ width: '340px' }}>
            <Card.Content>
              <Card.Header style={{ fontSize: "25px" }}>{selectedHotel!.ime}</Card.Header>
              <Card.Meta>
                <span className="date" style={{ fontSize: "15px" }}>Udaljenost od skijalista: {selectedHotel!.udaljenost} m</span>
              </Card.Meta>
              <Card.Description style={{ fontSize: "20px" }}>
                Cena dvokrevetne sobe: {selectedHotel!.cenaDvokrevetneSobe} din
                Cena trokrevetne sobe: {selectedHotel!.cenaTrokrevetneSobe} din
                Cena cetvorokrevetne sobe: {selectedHotel!.cenaCetvorokrevetneSobe} din
                Cena petokrevetne sobe: {selectedHotel!.cenaPetokrevetneSobe} din
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <a>
              <Rating rating={Math.round(selectedHotel!.ocena * 2) / 2} maxRating={5} disabled/>
              </a>
            </Card.Content>
          </Card>
    </div>
    
  )
}
export default observer(CardWithHotelInfo);