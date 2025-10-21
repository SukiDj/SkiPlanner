import React, { useEffect, useState } from "react";
import { Button, Card, Grid, Icon, Label, Modal } from "semantic-ui-react";
import { VacationOptions } from "../../modules/VacationOptions";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";
import Map from "../Map/Map";
import { Recommendation } from "../../modules/Recommendations";

const Recommendations = () => {
  const { vacationStore, skiResortStore,hotelStore,restaurantStore,userStore } = useStore();
  const { getVacationOptions } = vacationStore;
  const {setSelectedResort,setSelectedSkiResortLatLng} = skiResortStore;
  const {setSelectedHotel} = hotelStore;
  const {setSelectedRestaurant} = restaurantStore;
  const {visitOption, listRecommendations, getRecommendations} = userStore;

    useEffect(()=>{
        listRecommendations();
    },[])
  const [selectedOption, setSelectedOption] = useState<VacationOptions | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const onSelect = (option: VacationOptions) => {
    setSelectedOption(option);
    setSelectedResort(option.skijaliste);
    setModalOpen(true);
    visitOption(option);
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
console.log(getRecommendations)
  return (
    <>
      <Grid container style={{ justifyContent: "center" }} columns={1}>
  {getRecommendations.map((option: Recommendation) => (
    <Grid key={option.skijaliste.id} style={{ width: 1000, marginTop: 20 }} stackable columns={1}>
      {/* Glavna kartica - skijalište */}
      <Card fluid color="blue" style={{ marginBottom: "1.5em" }}>
        <Card.Content>
          <Card.Header style={{ fontSize: "1.7em", marginBottom: "1em" }}>
            <Icon name="snowflake" /> {option.skijaliste.ime}
          </Card.Header>
          <Card.Description style={{ fontSize: "1.2em" }}>
            <p><Icon name="ticket" /> <strong>Ski pas:</strong> {option.skijaliste.cenaSkiPasa} RSD</p>
            <p><Icon name="road" /> <strong>Broj staza:</strong> {option.skijaliste.brojStaza}</p>
            <p><Icon name="star" /> <strong>Popularnost:</strong> {option.skijaliste.popularnost}</p>
          </Card.Description>
        </Card.Content>
      </Card>

      {/* Hoteli */}
      {option.hoteli.map(h => (
        <Card key={h.id} fluid color="teal" style={{ marginBottom: "1em" }}>
          <Card.Content>
            <Card.Header style={{ fontSize: "1.4em", marginBottom: "0.5em" }}>
              <Icon name="hotel" /> {h.ime}
            </Card.Header>
            <Card.Meta>
              <Label color="yellow" size="large">Ocena: {h.ocena}</Label>
            </Card.Meta>
            <Card.Description>
              <p><strong>Cene soba:</strong></p>
              <p>2 <Icon name="hotel" />: {h.cenaDvokrevetneSobe} RSD | 3 <Icon name="hotel" />: {h.cenaTrokrevetneSobe} RSD</p>
              <p>4 <Icon name="hotel" />: {h.cenaCetvorokrevetneSobe} RSD | 5 <Icon name="hotel" />: {h.cenaPetokrevetneSobe} RSD</p>
              <p><Icon name="map marker alternate" /> <strong>Udaljenost:</strong> {h.udaljenost} m</p>
            </Card.Description>
          </Card.Content>
        </Card>
      ))}

      {/* Restorani */}
      {option.restorani.map(r => (
        <Card key={r.id} fluid color="orange" style={{ marginBottom: "1em" }}>
          <Card.Content>
            <Card.Header style={{ fontSize: "1.4em", marginBottom: "0.5em" }}>
              <Icon name="utensils" /> {r.naziv}
            </Card.Header>
            <Card.Meta>
              <Label color="yellow" size="large">Ocena: {r.ocena}</Label>
            </Card.Meta>
            <Card.Description>
              <p><Icon name="euro sign" /> <strong>Prosečna cena:</strong> {r.prosecnaCena} RSD</p>
              <p><Icon name="food" /> <strong>{r.tipKuhinje}</strong></p>
            </Card.Description>
          </Card.Content>
        </Card>
      ))}
    </Grid>
  ))}
</Grid>

    </>
  );
};

export default observer(Recommendations);
