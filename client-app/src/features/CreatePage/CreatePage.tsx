import React, { useState } from 'react'
import { Button, ButtonGroup } from 'semantic-ui-react'
import HotelForm from './Forms/HotelForm';
import RestaurantForm from './Forms/RestaurantForm';
import SkiResortForm from './Forms/SkiResortForm';
import SkiSlopeForm from './Forms/SkiSlopeForm';

export default function CreatePage() {
    const [activeForm, setActiveForm] = useState<string | null>(null);

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
