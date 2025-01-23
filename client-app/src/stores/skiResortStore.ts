import { store } from './store';
import { makeAutoObservable } from 'mobx';
import { SkiResort } from '../modules/SkiResort';
import agent from '../api/agent';

export default class SkiResortStore {
 
    resorts =  new Map<string,SkiResort>()
    selectedResort : any | undefined = undefined

    constructor(){
        makeAutoObservable(this)
    }

    get getSkiResortOptions(){
      return Array.from(this.getAllResorts.values()).map((skiResort : SkiResort) =>({
        key : skiResort.id,
        text : skiResort.ime,
        value : skiResort.id
      }))
    }

    setSelectedResort = (resort:any) => {
        this.selectedResort = resort
        store.hotelStore.hotelRegistry = resort.hotels
        console.log(this.selectedResort) 
    }

    setSkiResort = (skiResort:SkiResort)=>{
      this.resorts.set(skiResort.id!,skiResort);
    }

    get getAllResorts(){
      return Array.from(this.resorts.values());
    }

    loadAllResorts = async () =>{
      try{
        const resort : SkiResort[] = await agent.skiResort.list();
        console.log(resort)
        resort.forEach(resort=>{
          this.setSkiResort(resort);
        });
      }catch(error){
        console.log(error)
      }
    }

    createSkiResort = async (skiResort: SkiResort) =>{
      try{
        await agent.skiResort.create(skiResort);
      }catch (error)
      {
        console.log(error);
      }
    }
}
