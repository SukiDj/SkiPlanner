import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup } from 'semantic-ui-react'
import HotelForm from './Forms/HotelForm';
import RestaurantForm from './Forms/RestaurantForm';
import SkiResortForm from './Forms/SkiResortForm';
import SkiSlopeForm from './Forms/SkiSlopeForm';
import { useStore } from '../../stores/store';

export default function CreatePage() {
    const [activeForm, setActiveForm] = useState<string | null>(null);
    const {hotelStore,restaurantStore, skiResortStore} = useStore();
    const {selectedHotel, setSelectedHotel} = hotelStore;
    const {selectedRestaurant,setSelectedRestaurant} = restaurantStore;
    const {selectedResort, setSelectedResort} = skiResortStore;

    useEffect(()=>{
      if(selectedHotel)
        setSelectedHotel(undefined);
      if(selectedRestaurant)
        setSelectedRestaurant(undefined);
      if(selectedResort)
        setSelectedResort(undefined);
    },[selectedHotel,selectedRestaurant,selectedResort])

  return (
    <>
        <ButtonGroup widths='4' basic>
            <Button onClick={() => setActiveForm("hotel")}>Hotel</Button>
            <Button onClick={() => setActiveForm("restoran")}>Restoran</Button>
            <Button onClick={() => setActiveForm("skijaliste")}>Skijaliste</Button>
            <Button onClick={() => setActiveForm("skiStaza")}>Ski staza</Button>
        </ButtonGroup>

        {activeForm === "hotel" && <HotelForm />}
        {activeForm === "restoran" && <RestaurantForm />}
        {activeForm === "skijaliste" && <SkiResortForm />}
        {activeForm === "skiStaza" && <SkiSlopeForm />}
    </>
    
  )
}
