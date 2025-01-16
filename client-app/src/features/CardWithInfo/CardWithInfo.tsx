import { Card, Icon, Image } from "semantic-ui-react";
import { useStore } from "../../stores/store";

export default function CardWithInfo() {
  const {hotelStore} = useStore()
  const {selectedHotel} = hotelStore
  return (
    <div className="card-container">
        <Card>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
              wrapped
              ui={false}
            />
            <Card.Content>
              <Card.Header>{selectedHotel!.ime}</Card.Header>
              <Card.Meta>
                <span className="date">Joined in 2015</span>
              </Card.Meta>
              <Card.Description>
                {selectedHotel!.udaljenost || "No description available."}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <a>
                <Icon name="user" />
                22 Friends
              </a>
            </Card.Content>
          </Card>
    </div>
    
  )
}
