import { useEffect } from "react";
import { useStore } from "../../stores/store";
import SkiResortList from "../SkiResortsList/SkiResortList";
import SkiSlopes from "../SkiSlopes/SkiSlopes";
import Map from "../Map/Map"
import { observer } from "mobx-react-lite";
import { Loader } from "semantic-ui-react";
import LoadingComponent from "../../layout/LoadingComponent";

 function HomePage() {
    const {skiResortStore : {selectedResort, loadAllResorts, isLoading},mapStore:{setIsCreating}} = useStore() 
    
      useEffect(()=>{
        loadAllResorts();
        setIsCreating(false);
      },[loadAllResorts])
      if(isLoading) return <LoadingComponent content='Ucitavanje sajta...' />
  return (
    <>
        <div className='container'>
            <div className='mapContainer'>
                <Map onLocationSelect={function (lat: number, lng: number): void {} }/>
            </div>
            <div className='listContainer'>
              {
                isLoading? <Loader inverted content='Loading' /> : <SkiResortList/>
              }
                
            </div>
            
        </div>
        {selectedResort && <SkiSlopes/>}
    </>
  )
}
export default observer(HomePage);