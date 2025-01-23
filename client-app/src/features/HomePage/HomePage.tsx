import { useEffect } from "react";
import { useStore } from "../../stores/store";
import SkiResortList from "../SkiResortsList/SkiResortList";
import SkiSlopes from "../SkiSlopes/SkiSlopes";
import Map from "../Map/Map"
import { observer } from "mobx-react-lite";

 function HomePage() {
    const {skiResortStore : {selectedResort, loadAllResorts},mapStore:{setIsCreating}} = useStore() 
    
      useEffect(()=>{
        loadAllResorts();
        setIsCreating(false);
      },[loadAllResorts])

  return (
    <>
        <div className='container'>
            <div className='mapContainer'>
                <Map onLocationSelect={function (lat: number, lng: number): void {} }/>
            </div>
            <div className='listContainer'>
                <SkiResortList/>
            </div>
            
        </div>
        {selectedResort && <SkiSlopes/>}
    </>
  )
}
export default observer(HomePage);