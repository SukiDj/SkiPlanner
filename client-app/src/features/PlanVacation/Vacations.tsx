import React, { useState } from "react";
import { Button, Card, Grid, Icon, Label, Modal } from "semantic-ui-react";
import { VacationOptions } from "../../modules/VacationOptions";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";
import Map from "../Map/Map";

const Vacations = () => {
  const { vacationStore, skiResortStore,hotelStore,restaurantStore } = useStore();
  const { getVacationOptions } = vacationStore;
  const {setSelectedResort,setSelectedSkiResortLatLng} = skiResortStore;
  const {setSelectedHotel} = hotelStore;
  const {setSelectedRestaurant} = restaurantStore;


  const [selectedOption, setSelectedOption] = useState<VacationOptions | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const onSelect = (option: VacationOptions) => {
    setSelectedOption(option);
    setSelectedResort(option.skijaliste);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOption(null);
    setSelectedHotel(undefined);
    setSelectedResort(undefined);
    setSelectedRestaurant(undefined);
  };

  const showHotel = () => {
    if (selectedOption) {
      setSelectedRestaurant(undefined);
      setSelectedHotel(selectedOption.hotel);
    }
  };

  const showRestaurant = () => {
    if (selectedOption) {
      setSelectedHotel(undefined);
      setSelectedRestaurant(selectedOption.restoran);
    }
  };

  return (
    <>
      <Grid container style={{ justifyContent: "center" }} columns={1}>
        {getVacationOptions.map((option: VacationOptions) => (
          <Grid key={option.skijaliste.id} style={{ width: 1000, marginTop: 20 }} stackable columns={1}>
            <Card fluid>
              <Grid columns={3} divided stackable>
                <Grid.Row stretched>
                  <Grid.Column>
                    <Card fluid color="blue" style={{ height: "100%" }}>
                      <Card.Content
                        style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}
                      >
                        <div>
                          <Card.Header style={{ fontSize: "1.7em", marginBottom: "1em", marginTop: "-7px" }}>
                            <p>
                              <Icon name="snowflake" /> {option.skijaliste.ime}
                            </p>
                          </Card.Header>
                          <Card.Description style={{ fontSize: "1.2em", marginBottom: "0.5em", paddingTop: 30 }}>
                            <p>
                              <Icon name="ticket" /> <strong>Ski pas:</strong> {option.skijaliste.cenaSkiPasa} RSD
                            </p>
                            <p>
                              <Icon name="road" /> <strong>Staza:</strong> {option.skijaliste.brojStaza}
                            </p>
                            <p>
                              <Icon name="star" /> <strong>Popularnost:</strong> {option.skijaliste.popularnost}
                            </p>
                          </Card.Description>
                        </div>
                      </Card.Content>
                    </Card>
                  </Grid.Column>

                  {/* Hotel */}
                  <Grid.Column>
                    <Card fluid color="teal" style={{ height: "100%" }}>
                      <Card.Content
                        style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}
                      >
                        <div>
                          <Card.Header style={{ fontSize: "1.7em", marginBottom: "1em" }}>
                            <Icon name="hotel" /> {option.hotel.ime}
                          </Card.Header>
                          <Card.Meta style={{ marginBottom: "1em", fontSize: "1.2em" }}>
                            <Label color="yellow" size="large">
                              Ocena: {option.hotel.ocena}
                            </Label>
                          </Card.Meta>
                          <Card.Description style={{ fontSize: "1.2em", marginBottom: "1em" }}>
                            <p>
                              <strong>Cene soba:</strong>
                            </p>
                            <p>
                              2 <Icon name="hotel" />: {option.hotel.cenaDvokrevetneSobe} RSD | 3 <Icon name="hotel" />:{" "}
                              {option.hotel.cenaTrokrevetneSobe} RSD
                            </p>
                            <p>
                              4 <Icon name="hotel" />: {option.hotel.cenaCetvorokrevetneSobe} RSD | 5 <Icon name="hotel" />:{" "}
                              {option.hotel.cenaPetokrevetneSobe} RSD
                            </p>
                          </Card.Description>
                          <Card.Meta style={{ fontSize: "1.2em" }}>
                            <Icon name="map marker alternate" /> <strong>Udaljenost:</strong> {option.hotel.udaljenost} m
                          </Card.Meta>
                        </div>
                      </Card.Content>
                    </Card>
                  </Grid.Column>

                  {/* Restoran */}
                  <Grid.Column>
                    <Card fluid color="orange" style={{ height: "100%" }}>
                      <Card.Content
                        style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}
                      >
                        <div>
                          <Card.Header style={{ fontSize: "1.7em", marginBottom: "1em" }}>
                            <Icon name="utensils" /> {option.restoran.naziv}
                          </Card.Header>
                          <Card.Meta style={{ fontSize: "1.2em" }}>
                            <Label color="yellow" size="large">
                              Ocena: {option.restoran.ocena}
                            </Label>
                          </Card.Meta>
                          <Card.Description style={{ fontSize: "1.2em", marginBottom: "0.5em", paddingTop: 30 }}>
                            <p>
                              <Icon name="euro sign" /> <strong>Prosečna cena:</strong> {option.restoran.prosecnaCena} RSD
                            </p>
                            <p>
                              <Icon name="food" /> <strong>{option.restoran.tipKuhinje}</strong>
                            </p>
                          </Card.Description>
                        </div>
                      </Card.Content>
                    </Card>
                  </Grid.Column>
                </Grid.Row>
              </Grid>

              <Card.Content
                extra
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div style={{ flex: 1, textAlign: "left", fontSize: "1.5em" }}>
                  <Icon name="money bill alternate outline" />
                  <strong>Ukupna Cena:</strong> {option.ukupnaCena.toFixed(2)} RSD
                </div>
                <Button primary size="large" onClick={() => onSelect(option)}>
                  Izaberi
                </Button>
              </Card.Content>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal */}
      <Modal open={modalOpen} onClose={closeModal} closeIcon size="large" closeOnDimmerClick>
        <Modal.Header>
          Detalji skijanja i smeštaja: {selectedOption?.skijaliste.ime}
        </Modal.Header>
        <Modal.Content scrolling>
          {selectedOption && (
            <>
              <Grid columns={2} stackable>
                <Grid.Column width={8}>
                  {/* Prikaz istih informacija, ali lepše */}
                  <Card fluid color="blue" style={{ marginBottom: 20 }}>
                    <Card.Content>
                      <Card.Header>
                        <Icon name="snowflake" /> Skijalište: {selectedOption.skijaliste.ime}
                      </Card.Header>
                      <Card.Description>
                        <p>
                          <Icon name="ticket" /> Ski pas: {selectedOption.skijaliste.cenaSkiPasa} RSD
                        </p>
                        <p>
                          <Icon name="road" /> Broj staza: {selectedOption.skijaliste.brojStaza}
                        </p>
                        <p>
                          <Icon name="star" /> Popularnost: {selectedOption.skijaliste.popularnost}
                        </p>
                      </Card.Description>
                    </Card.Content>
                  </Card>

                  <Card fluid color="teal" style={{ marginBottom: 20 }}>
                    <Card.Content>
                      <Card.Header>
                        <Icon name="hotel" /> Hotel: {selectedOption.hotel.ime}
                      </Card.Header>
                      <Card.Meta>
                        <Label color="yellow" size="large">
                          Ocena: {selectedOption.hotel.ocena}
                        </Label>
                      </Card.Meta>
                      <Card.Description>
                        <p>
                          <strong>Cene soba:</strong>
                        </p>
                        <p>
                          2 <Icon name="hotel" />: {selectedOption.hotel.cenaDvokrevetneSobe} RSD | 3{" "}
                          <Icon name="hotel" />: {selectedOption.hotel.cenaTrokrevetneSobe} RSD
                        </p>
                        <p>
                          4 <Icon name="hotel" />: {selectedOption.hotel.cenaCetvorokrevetneSobe} RSD | 5{" "}
                          <Icon name="hotel" />: {selectedOption.hotel.cenaPetokrevetneSobe} RSD
                        </p>
                      </Card.Description>
                      <Card.Meta>
                        <Icon name="map marker alternate" /> Udaljenost: {selectedOption.hotel.udaljenost} m
                      </Card.Meta>
                    </Card.Content>
                    <Button fluid color="teal" onClick={showHotel} style={{ marginTop: "10px" }}>
                      Prikaži hotel
                    </Button>
                  </Card>

                  <Card fluid color="orange">
                    <Card.Content>
                      <Card.Header>
                        <Icon name="utensils" /> Restoran: {selectedOption.restoran.naziv}
                      </Card.Header>
                      <Card.Meta>
                        <Label color="yellow" size="large">
                          Ocena: {selectedOption.restoran.ocena}
                        </Label>
                      </Card.Meta>
                      <Card.Description>
                        <p>
                          <Icon name="euro sign" /> Prosečna cena: {selectedOption.restoran.prosecnaCena} RSD
                        </p>
                        <p>
                          <Icon name="food" /> Tip kuhinje: {selectedOption.restoran.tipKuhinje}
                        </p>
                      </Card.Description>
                    </Card.Content>
                    <Button fluid color="orange" onClick={showRestaurant} style={{ marginTop: "10px" }}>
                      Prikaži restoran
                    </Button>
                  </Card>
                </Grid.Column>

                <Grid.Column width={8}>
                  {/* Mapa */}
                  <div style={{ height: "500px", borderRadius: "8px", overflow: "hidden" }}>
                    <Map onLocationSelect={() =>{}} />
                  </div>
                </Grid.Column>
              </Grid>
            </>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={closeModal} negative>
            Zatvori
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default observer(Vacations);
