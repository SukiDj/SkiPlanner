import { useEffect } from "react";
import { useStore } from "../../stores/store";
import SkiResortList from "../SkiResortsList/SkiResortList";
import SkiSlopes from "../SkiSlopes/SkiSlopes";
import Map from "../Map/Map"
import { observer } from "mobx-react-lite";

 function HomePage() {
    const {skiResortStore : {selectedResort, loadAllResorts}} = useStore() 
    
      useEffect(()=>{
        loadAllResorts();
      },[loadAllResorts])

  return (
    <>
        <div className='container'>
            <div className='mapContainer'>
                <Map/>
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