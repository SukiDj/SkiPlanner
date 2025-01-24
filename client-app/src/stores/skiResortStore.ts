import { store } from './store';
import { makeAutoObservable, runInAction } from 'mobx';
import { SkiResort } from '../modules/SkiResort';
import agent from '../api/agent';

export default class SkiResortStore {
 
    resorts =  new Map<string,SkiResort>();
    selectedResort : SkiResort | undefined = undefined;
    isLoading : boolean = false;

    constructor(){
        makeAutoObservable(this)
    }
    setIsLoading(value:boolean){
      this.isLoading = value;
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
    }

    setSkiResort = (skiResort:SkiResort)=>{
      this.resorts.set(skiResort.id!,skiResort);
    }

    get getAllResorts(){
      return Array.from(this.resorts.values());
    }

    loadAllResorts = async () =>{
      try{
        this.setIsLoading(true);
        const resort : SkiResort[] = await agent.skiResort.list();
        runInAction(()=>{
          resort.forEach(resort=>{
            this.setSkiResort(resort);
          });
        })
        this.setIsLoading(false);

        
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
