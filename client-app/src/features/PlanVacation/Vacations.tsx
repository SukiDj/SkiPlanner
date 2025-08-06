import { Button, Card, Grid, Icon, Label } from "semantic-ui-react";
import { VacationOptions } from "../../modules/VacationOptions";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";

const Vacations = () =>{
 
    const {vacationStore} = useStore();
    const {getVacationOptions} = vacationStore;

    const onSelect = () =>{

    }

    return(
      <Grid container style={{justifyContent: "center"}} columns={1}>
      {getVacationOptions.map((option: VacationOptions) =>(
        <Grid style={{ width: 1000, marginTop: 20 }} stackable columns={1}>
  <Card fluid>
    <Grid columns={3} divided stackable>
      <Grid.Row stretched>

        <Grid.Column>
          <Card fluid color='blue' style={{ height: '100%' }}>
            <Card.Content style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <div>
                <Card.Header style={{ fontSize: '1.7em', marginBottom: '1em', marginTop:"-7px"}}>
                  <p><Icon name='snowflake' /> {option.skijaliste.ime}</p>
                </Card.Header>
                <Card.Description style={{ fontSize: '1.2em', marginBottom: '0.5em', paddingTop:30  }}>
                  <p><Icon name='ticket' /> <strong>Ski pas:</strong> {option.skijaliste.cenaSkiPasa} RSD</p>
                  <p><Icon name='road' /> <strong>Staza:</strong> {option.skijaliste.brojStaza}</p>
                  <p><Icon name='star' /> <strong>Popularnost:</strong> {option.skijaliste.popularnost}</p>
                </Card.Description>
              </div>
            </Card.Content>
          </Card>
        </Grid.Column>

        {/* Hotel */}
        <Grid.Column>
          <Card fluid color='teal' style={{ height: '100%' }}>
            <Card.Content style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <div>
                <Card.Header style={{ fontSize: '1.7em', marginBottom: '1em' }}>
                  <Icon name='hotel' /> {option.hotel.ime}
                </Card.Header>
                <Card.Meta style={{ marginBottom: '1em', fontSize: '1.2em' }}>
                  <Label color='yellow' size='large'>Ocena: {option.hotel.ocena}</Label>
                </Card.Meta>
                <Card.Description style={{ fontSize: '1.2em', marginBottom: '1em' }}>
                  <p><strong>Cene soba:</strong></p>
                  <p>2 <Icon name='hotel' />: {option.hotel.cenaDvokrevetneSobe} RSD | 3 <Icon name='hotel' />: {option.hotel.cenaTrokrevetneSobe} RSD</p>
                  <p>4 <Icon name='hotel' />: {option.hotel.cenaCetvorokrevetneSobe} RSD | 5 <Icon name='hotel' />: {option.hotel.cenaPetokrevetneSobe} RSD</p>
                </Card.Description>
                <Card.Meta style={{ fontSize: '1.2em' }}>
                  <Icon name='map marker alternate' /> <strong>Udaljenost:</strong> {option.hotel.udaljenost} m
                </Card.Meta>
              </div>
            </Card.Content>
          </Card>
        </Grid.Column>

        {/* Restoran */}
        <Grid.Column>
          <Card fluid color='orange' style={{ height: '100%' }}>
            <Card.Content style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <div>
                <Card.Header style={{ fontSize: '1.7em', marginBottom: '1em' }}>
                  <Icon name='utensils' /> {option.restoran.naziv}
                </Card.Header>
                <Card.Meta style={{ fontSize: '1.2em' }}>
                  <Label color='yellow' size='large'>Ocena: {option.restoran.ocena}</Label>
                </Card.Meta>
                <Card.Description style={{ fontSize: '1.2em', marginBottom: '0.5em', paddingTop:30  }}>
                  <p><Icon name='euro sign' /> <strong>Prosečna cena:</strong> {option.restoran.prosecnaCena} RSD</p>
                  <p><Icon name='food' /> <strong>{option.restoran.tipKuhinje}</strong></p>
                </Card.Description>
              </div>
            </Card.Content>
          </Card>
        </Grid.Column>

      </Grid.Row>
    </Grid>

    <Card.Content extra style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <div style={{ flex: 1, textAlign: 'left', fontSize: '1.5em' }}>
    <Icon name="money bill alternate outline" />
    <strong>Ukupna Cena:</strong> {option.ukupnaCena.toFixed(2)} RSD
  </div>
  <Button primary size='large' onClick={() => onSelect()}>
    Izaberi
  </Button>
</Card.Content>

  </Card>
</Grid>



      )
    )
        
      }
      </Grid>
    )
}
export default observer(Vacations);