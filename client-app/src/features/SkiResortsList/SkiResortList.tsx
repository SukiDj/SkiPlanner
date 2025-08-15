import { Accordion, Button, Icon, Modal } from "semantic-ui-react";
import { useStore } from "../../stores/store";
import { useState } from "react";
import HotelList from "../HotelList/HotelList"; // If you want a separate component for the hotel list
import { observer } from "mobx-react-lite";
import RestaurantList from "../RestaurantList/RestaurantList";
import { SkiResort } from "../../modules/SkiResort";
import SkiResortForm from "../CreatePage/Forms/SkiResortForm";

function SkiResortList() {
  const { skiResortStore, hotelStore, restaurantStore:{loadRestaurants, setSelectedRestaurant}, skiSlopeStore:{loadAllSkiSlopes},userStore } = useStore();
  const { resorts, setSelectedResort, getAllResorts, setIsSkyResortEditing, selectedResort, deleteSkiResort } = skiResortStore;
  const {loadHotelsForResort, setSelectedHotel} = hotelStore;
  const {isEmploye} = userStore;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeHotel, setActiveHotel] = useState(false);
  const [activeRestaurant, setActiveRestaurant] = useState(false);

  const handleClick = (resort: SkiResort, index: number) => {
    setActiveIndex(activeIndex === index ? null : index); // Toggle resort accordion
    setSelectedResort(resort);
    loadHotelsForResort(resort.id!);
    loadRestaurants(resort.id!);
    loadAllSkiSlopes(resort.id!);
  };

  const toggleHotels = () => {
    
    setActiveHotel(!activeHotel); // Toggle hotels accordion
    setActiveRestaurant(activeRestaurant === true ? false : activeRestaurant)
    

  };

  const toggleRestaurants = () => {
    setActiveRestaurant(!activeRestaurant); // Toggle restaurants accordion
    setActiveHotel(activeHotel === true ? false : activeHotel)
  };

  const [formOpen, setFormOpen] = useState(false);

  const handleClose = () => {
      setFormOpen(false);
      setIsSkyResortEditing(false);
    };
  
    const handleEditClick = (resort: SkiResort) => {
        setSelectedResort(resort);
        setSelectedHotel(undefined);
        setSelectedRestaurant(undefined);
        setFormOpen(true);
        setIsSkyResortEditing(true);
    };

  return (
    <>
    <Accordion styled>
      {getAllResorts.map((resort, index) => (
        <div key={resort.ime}>
          {/* Resort Header */}
          <Accordion.Title
            active={activeIndex === index}
            index={index}
            onClick={() => handleClick(resort, index)}
          >
            <Icon name="dropdown" />
            {resort.ime}
          </Accordion.Title>

          {/* Resort Content */}
          <Accordion.Content active={activeIndex === index}>
            {/* Hotels */}
            <Accordion styled>
              <Accordion.Title
                active={activeHotel}
                index={index}
                onClick={() => toggleHotels()}
              >
                <Icon name="dropdown" />
                Hotels
              </Accordion.Title>
              <Accordion.Content active={activeHotel}>
                <HotelList/>
              </Accordion.Content>
            </Accordion>

            {/* Restaurants */}
            <Accordion styled>
              <Accordion.Title
                active={activeRestaurant}
                index={index}
                onClick={() => toggleRestaurants()}
              >
                <Icon name="dropdown" />
                Restaurants
              </Accordion.Title>
              <Accordion.Content active={activeRestaurant}>
                <RestaurantList />
              </Accordion.Content>
            </Accordion>
          </Accordion.Content>
          {isEmploye && <>
          <Button
            size="small"
            onClick={() => handleEditClick(resort)}
            content="Izmeni"
          />
          <Button
            size="small"
            color="red"
            content="Obrisi"
            onClick={() => deleteSkiResort(resort.id!)}
            />
          </>}
          
        </div>
      ))}
    </Accordion>
    <Modal
        open={formOpen}
        onClose={handleClose}
        size="large"
        dimmer="blurring"
      >
        <Modal.Content>
          {selectedResort && (
            <SkiResortForm
              initialSkiResort={selectedResort}
              onFormSubmit={(updatedResort) => {
              skiResortStore.updateSkiResort(updatedResort.id!, updatedResort);
              }
          }
            />
          )}
        </Modal.Content>
      </Modal>
    </>
  );
}

export default observer(SkiResortList);
