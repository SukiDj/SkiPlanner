import { Accordion, Icon } from "semantic-ui-react";
import { useStore } from "../../stores/store";
import { useState } from "react";
import HotelList from "../HotelList/HotelList"; // If you want a separate component for the hotel list
import { observer } from "mobx-react-lite";
import RestaurantList from "../RestaurantList/RestaurantList";
import { SkiResort } from "../../modules/SkiResort";

function SkiResortList() {
  const { skiResortStore, hotelStore, restaurantStore:{loadRestaurants}, skiSlopeStore:{loadAllSkiSlopes} } = useStore();
  const { resorts, setSelectedResort, getAllResorts } = skiResortStore;
  const {loadHotelsForResort} = hotelStore;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeHotel, setActiveHotel] = useState(false);
  const [activeRestaurant, setActiveRestaurant] = useState(false);

  const handleClick = (resort: SkiResort, index: number) => {
    setActiveIndex(activeIndex === index ? null : index); // Toggle resort accordion
    setSelectedResort(resort);
    loadHotelsForResort(resort.id);
    loadRestaurants(resort.id);
    loadAllSkiSlopes(resort.id);
  };

  const toggleHotels = () => {
    
    setActiveHotel(!activeHotel); // Toggle hotels accordion
    setActiveRestaurant(activeRestaurant === true ? false : activeRestaurant)
    

  };

  const toggleRestaurants = () => {
    setActiveRestaurant(!activeRestaurant); // Toggle restaurants accordion
    setActiveHotel(activeHotel === true ? false : activeHotel)
  };

  return (
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
        </div>
      ))}
    </Accordion>
  );
}

export default observer(SkiResortList);
