import { makeAutoObservable, runInAction } from "mobx";
import { VacationOptions } from "../modules/VacationOptions";
import { Vacation } from "../modules/Vacation";
import agent from "../api/agent";

export default class VacationStore {
    vacationOptions =  new Map<string,VacationOptions>();

    constructor(){
        makeAutoObservable(this);
    }

    get getVacationOptions(){
      return Array.from(this.vacationOptions.values());
    }

    filterAllVacations = async (filters: Vacation) =>{
        try{
            const vacationOpt : VacationOptions[] =  await agent.skiResort.filter(filters);
            runInAction(()=>{
                vacationOpt.forEach(vacation=>{
                this.setSkiResort(vacation);
                });
            })
        }
        catch(error){
            console.log(error);
        }
    }

    setSkiResort = (option:VacationOptions)=>{
        this.vacationOptions.set(option.id,option);
    }
}