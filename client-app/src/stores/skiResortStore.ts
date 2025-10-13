import { store } from './store';
import { makeAutoObservable, runInAction } from 'mobx';
import { SkiResort } from '../modules/SkiResort';
import agent from '../api/agent';
import { toast } from 'react-toastify';

export default class SkiResortStore {
 
    resorts =  new Map<string,SkiResort>();
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
      return Array.from(this.getAllResorts.values()).map((skiResort : SkiResort) =>({
        key : skiResort.id,
        text : skiResort.ime,
        value : skiResort.id
      }))
    }

    setSelectedSkiResortLatLng = (lat: number, lng: number) =>{
    this.selectedResort!.lat = lat;
    this.selectedResort!.lng = lng;
  }

  updateSkiResort = async (id:string, resort: SkiResort) =>{
    this.setLoading(true);
    try{
      await agent.skiResort.update(id,resort);
      this.resorts.set(id, resort);
      if (this.selectedResort?.id === id) {
        this.selectedResort = resort;
      }
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
      await agent.skiResort.delete(id);
      this.resorts.delete(id);
      if(this.selectedResort?.id === id)
        this.setSelectedResort(undefined);
    }catch(err){
      console.log(err)
    }
    this.setLoading(false);
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
      this.setLoading(true);
      try{
        await agent.skiResort.create(skiResort);
        toast.success("Uspesno kreiranje skijalista!");
      }catch (error)
      {
        console.log(error);
      }
      this.setLoading(false);
    }
}
