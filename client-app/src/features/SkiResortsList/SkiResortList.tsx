import { Accordion, Icon } from "semantic-ui-react";
import { useStore } from "../../stores/store";
import { useState } from "react";
import HotelList from "../HotelList/HotelList";
import { observer } from "mobx-react-lite";

 function SkiResortList() {
    const {skiResortStore} = useStore()
    const {resorts, setSelectedResort, selectedResort} = skiResortStore

    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const handleClick = (resort:any, index: number) => {
        setActiveIndex(activeIndex === index ? null : index); // Toggle accordion
        setSelectedResort(resort)
        console.log(selectedResort)
      };
      
  return (
    <Accordion styled>
      {resorts.map((resort, index) => (
        <div key={resort.name}>
          {/* Resort Header */}
          <Accordion.Title
            active={activeIndex === index}
            index={index}
            onClick={() => handleClick(resort,index)}
          >
            <Icon name="dropdown" />
            {resort.name}
          </Accordion.Title>
          {/* Hotels List */}
          <Accordion.Content active={activeIndex === index} >
                <HotelList/>

          </Accordion.Content>
        </div>
      ))}
    </Accordion>
  )
}
export default observer(SkiResortList)