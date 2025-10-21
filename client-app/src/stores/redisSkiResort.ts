import { store } from './store';
import { makeAutoObservable, runInAction } from 'mobx';
import { SkiResort } from '../modules/SkiResort';
import agent from '../api/agent';
import { toast } from 'react-toastify';
import { RedisSkiResort } from '../modules/RedisSkiResort';
import { websocketService } from '../services/websocketService';

export default class RedisSkiResortStore {
 
    resorts =  new Map<string,RedisSkiResort>();
    selectedResort : SkiResort | undefined = undefined;
    isLoading : boolean = false;
    isSkyResortEditing : boolean = false;
    loading: boolean = false;
    subscribedResorts =new Map<string,RedisSkiResort>();
    skiResorts = new Map<string,RedisSkiResort>();

    constructor(){
        makeAutoObservable(this)
    }
    setIsLoading(value:boolean){
      this.isLoading = value;
    }

    setIsSkyResortEditing = (value : boolean) => this.isSkyResortEditing = value;

    setLoading = (val: boolean) => this.loading = val;

     get getResorts(){
      return Array.from(this.skiResorts.values());
    }

    get getSkiResortOptions(){
      return Array.from(this.getResorts.values()).map((skiResort) =>({
        key : skiResort.ime,
        text : skiResort.ime,
        value : skiResort.ime
      }))
    }

    setSelectedSkiResortLatLng = (lat: number, lng: number) =>{
    this.selectedResort!.lat = lat;
    this.selectedResort!.lng = lng;
  }

  setSkiReorts = (skiResort:RedisSkiResort) =>{
    this.skiResorts.set(skiResort.ime!,skiResort);
  }

  getSkiResortNames = async () =>{
    try{
      const data = await agent.skiResort.list();
      const allResortNames = data.map((resort: any) => resort);
      const subscribedNames = Array.from(this.resorts.keys());
      const unsubscribedResorts = allResortNames.filter(
        (skiResort: RedisSkiResort) => !subscribedNames.includes(skiResort.ime)
      );
      runInAction(()=>{
          unsubscribedResorts.forEach(resort=>{
            this.setSkiReorts(resort);
          });
        })
      return unsubscribedResorts
    }
    catch(err){
      console.log(err);
    }
    
  } 

    setSelectedResort = (resort:any) => {
        this.selectedResort = resort
    }

    setSkiResort = (skiResort:RedisSkiResort)=>{
      this.resorts.set(skiResort.ime!,skiResort);
    }
    setSubbed = (skiResort:RedisSkiResort)=>{
      this.subscribedResorts.set(skiResort.ime!,skiResort);
    }


    get getAllResorts(){
      return Array.from(this.resorts.values());
    }

    get getAllSubbed(){
      return Array.from(this.subscribedResorts.values());
    }

    loadAllResorts = async () => {
  try {
    this.setIsLoading(true);

    const resorts: RedisSkiResort[] = await agent.redis.list();
    this.resorts.clear();
    runInAction(() => {
      
      const unsubscribed = resorts.filter(
        (resort) => !this.subscribedResorts.has(resort.ime) 
      );

      unsubscribed.forEach((resort) => {
        this.setSkiResort(resort);
      });

      this.setIsLoading(false);
    });
  } catch (error) {
    console.log(error);
    runInAction(() => this.setIsLoading(false));
  }
};

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

  subscribe = async (id:string,skiRes:string) =>{
    this.setLoading(true);
    try{
      await agent.redis.subscribe(id, skiRes);
      toast.success("Uspesno zapracivanje skijalista!");

      const socket = (websocketService as any).socket;
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send("refresh_subscriptions");
        console.log("🔁 Poslat refresh_subscriptions preko WebSocket-a");
      }
    }catch(err){
      console.log(err)
    }
    this.setLoading(false);
  }

  unSubscribe = async (id:string,skiRes:string) =>{
    this.setLoading(true);
    try{
      await agent.redis.unSubscribe(id, skiRes);
      toast.success("Uspesno odjavljivanje!");

      const socket = (websocketService as any).socket;
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send("refresh_subscriptions");
        console.log("🔁 Poslat refresh_subscriptions preko WebSocket-a");
      }
    }catch(err){
      console.log(err)
    }
    this.setLoading(false);
  }

  getAllSubbedSkiR = async (id:string) =>{
    try{
        this.setIsLoading(true);
        this.subscribedResorts.clear();
        const resort : RedisSkiResort[] = await agent.redis.getAllSubbed(id);
        runInAction(()=>{
          resort.forEach(resort=>{
            this.setSubbed(resort);
          });
        })
        this.setIsLoading(false);
        
      }catch(error){
        console.log(error)
      }
  }
}
