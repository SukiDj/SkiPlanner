import { makeAutoObservable, runInAction } from "mobx";
import { VacationOptions } from "../modules/VacationOptions";
import { Vacation } from "../modules/Vacation";
import agent from "../api/agent";

export default class VacationStore {
    vacationOptions =  new Map<string,VacationOptions>();
    loadingVacations : boolean = false;

    constructor(){
        makeAutoObservable(this);
    }

    get getVacationOptions(){
      return Array.from(this.vacationOptions.values());
    }

    setLoadingVacations = (val: boolean) => this.loadingVacations = val;

    deleteAllVacations = () => this.vacationOptions.clear();


    filterAllVacations = async (filters: Vacation) =>{
        this.setLoadingVacations(true);
        try{
            
            const vacationOpt : VacationOptions[] =  await agent.skiResort.filter(filters);
            runInAction(()=>{
                
            if(this.vacationOptions.size != 0)
                this.deleteAllVacations();
            
                vacationOpt.forEach(vacation=>{
                this.setSkiResort(vacation);
                });
            })
        }
        catch(error){
            console.log(error);
        }
        this.setLoadingVacations(false);
    }

    setSkiResort = (option:VacationOptions)=>{
        this.vacationOptions.set(option.id,option);
    }
}