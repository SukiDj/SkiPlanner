import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup } from 'semantic-ui-react'
import HotelForm from './Forms/HotelForm';
import RestaurantForm from './Forms/RestaurantForm';
import SkiResortForm from './Forms/SkiResortForm';
import SkiSlopeForm from './Forms/SkiSlopeForm';
import { useStore } from '../../stores/store';
import { Hotel } from '../../modules/Hotel';
import { v4 as uuid } from 'uuid';
import { SkiSlope } from '../../modules/SkiSlope';
import { Restaurant } from '../../modules/Restaurant';
import { SkiResort } from '../../modules/SkiResort';

export default function CreatePage() {
    const [activeForm, setActiveForm] = useState<string | null>(null);
    const {hotelStore,restaurantStore, skiResortStore,skiSlopeStore} = useStore();
    const {selectedHotel, setSelectedHotel, createHotel} = hotelStore;
    const {selectedRestaurant,setSelectedRestaurant, createRestaurant} = restaurantStore;
    const {selectedResort, setSelectedResort, createSkiResort} = skiResortStore;
    const {create} = skiSlopeStore;

    useEffect(()=>{
      if(selectedHotel)
        setSelectedHotel(undefined);
      if(selectedRestaurant)
        setSelectedRestaurant(undefined);
      if(selectedResort)
        setSelectedResort(undefined);
    },[selectedHotel,selectedRestaurant,selectedResort])

      const handleHotelSubmit = (hotel: Hotel) => {
        const hotelWithId = {
        ...hotel,
        id: uuid()
    };
    createHotel(hotelWithId.skijaliste!, hotelWithId);
  };

  const handleSlopeSubmit = (slope: SkiSlope) => {
    const newSlope = {
      ...slope,
      id: uuid()
    };
    create(newSlope.skijaliste!,newSlope);
  }

  const handleRestaurantSubmit = (restaurant: Restaurant) => {
    const newRestaurant = {
      ...restaurant,
      id: uuid()
    };
    createRestaurant(newRestaurant.skijaliste!,newRestaurant);
  }

  const handleSkiResortSubmit = (skiResort: SkiResort) =>{
    const newSkiResort = {
      ...skiResort,
      id: uuid()
    };
    createSkiResort(newSkiResort);
  }

  return (
    <>
        <ButtonGroup widths='4' basic>
            <Button onClick={() => setActiveForm("hotel")}>Hotel</Button>
            <Button onClick={() => setActiveForm("restoran")}>Restoran</Button>
            <Button onClick={() => setActiveForm("skijaliste")}>Skijaliste</Button>
            <Button onClick={() => setActiveForm("skiStaza")}>Ski staza</Button>
        </ButtonGroup>

        {activeForm === "hotel" && <HotelForm onFormSubmit={handleHotelSubmit} />}
        {activeForm === "restoran" && <RestaurantForm onFormSubmit={handleRestaurantSubmit} />}
        {activeForm === "skijaliste" && <SkiResortForm onFormSubmit={handleSkiResortSubmit}/>}
        {activeForm === "skiStaza" && <SkiSlopeForm onFormSubmit={handleSlopeSubmit} />}
    </>
    
  )
}
