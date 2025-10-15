import { store } from './store';
import { makeAutoObservable, runInAction } from 'mobx';
import { SkiResort } from '../modules/SkiResort';
import agent from '../api/agent';
import { toast } from 'react-toastify';
import { RedisSkiResort } from '../modules/RedisSkiResort';

export default class RedisSkiResortStore {
 
    resorts =  new Map<string,RedisSkiResort>();
    selectedResort : SkiResort | undefined = undefined;
    isLoading : boolean = false;
    isSkyResortEditing : boolean = false;
    loading: boolean = false

    constructor(){
        makeAutoObservable(this)
    }
    setIsLoading(value:boolean){
      this.isLoading = value;
    }

    setIsSkyResortEditing = (value : boolean) => this.isSkyResortEditing = value;

    setLoading = (val: boolean) => this.loading = val;

    get getSkiResortOptions(){
      return Array.from(this.getAllResorts.values()).map((skiResort : RedisSkiResort) =>({
        key : skiResort.ime,
        text : skiResort.ime,
        value : skiResort.ime
      }))
    }

    setSelectedSkiResortLatLng = (lat: number, lng: number) =>{
    this.selectedResort!.lat = lat;
    this.selectedResort!.lng = lng;
  }




    setSelectedResort = (resort:any) => {
        this.selectedResort = resort
    }

    setSkiResort = (skiResort:RedisSkiResort)=>{
      this.resorts.set(skiResort.ime!,skiResort);
    }

    get getAllResorts(){
      return Array.from(this.resorts.values());
    }

    loadAllResorts = async () =>{
      try{
        this.setIsLoading(true);
        const resort : RedisSkiResort[] = await agent.redis.list();
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

    createSkiResort = async (skiResort: RedisSkiResort) =>{
      this.setLoading(true);
      try{
        await agent.redis.create(skiResort);
        this.loadAllResorts();
        toast.success("Uspesno kreiranje skijalista!");
      }catch (error)
      {
        console.log(error);
      }
      this.setLoading(false);
    }

    updateSkiResort = async (resort: RedisSkiResort) =>{
    this.setLoading(true);
    try{
      await agent.redis.update(resort);
      toast.success("Uspesna izmena skijalista!");
    } catch (error)
    {
      console.log(error);
      toast.success("Doslo je do greske!");
    }
    this.setLoading(false);
  }

  deleteSkiResort = async (id:string) =>{
    this.setLoading(true);
    try{
      await agent.redis.delete(id);
      this.resorts.delete(id);
      toast.success("Uspesno brisanje!");
    }catch(err){
      console.log(err)
    }
    this.setLoading(false);
  }
}
