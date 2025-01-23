import { makeAutoObservable, runInAction } from "mobx";
import { SkiSlope } from "../modules/SkiSlope";
import agent from "../api/agent";

export default class SkiSlopeStore {

    redSkiSlopeRegistry = new Map<string,SkiSlope>();
    blueSkiSlopeRegistry = new Map<string,SkiSlope>();
    greenSkiSlopeRegistry = new Map<string,SkiSlope>();
    blackSkiSlopeRegistry = new Map<string,SkiSlope>();
    numberOfRedSSlopes : number = 0;
    numberOfBlueSSlopes : number = 0;
    numberOfGreenSSlopes : number = 0;
    numberOfBlackSSlopes : number = 0;
    color : string[] = [ "plava", "crvena", "zelena", "crna"]

    constructor(){
        makeAutoObservable(this);
    }

    create = async (id:string, skiSlope: SkiSlope) =>{
        try{
            await agent.skiSlope.create(id,skiSlope);

        } catch(error){
            console.log(error);
        }
    }

    get getSkiSlopeColor(){
        return  this.color.map((value) => ({
                key: value, // unique key for React
                text: value, // text displayed in the dropdown
                value: value, // value for selection
              }));
    }

    loadRedSSlope = async (id:string) =>{
        try{
            const red : SkiSlope[] = await agent.skiSlope.list(id,'crvena');
            runInAction(()=>{
                red.forEach(red=>{
                    this.redSkiSlopeRegistry.set(red.id,red);
                })
                this.numberOfRedSSlopes = red.length;
            })
        } catch (error){
            console.log(error)
        }
    }

    loadblueSSlope = async (id:string) =>{
        try{
            const blue : SkiSlope[] = await agent.skiSlope.list(id,'plava');
            runInAction(()=>{
                blue.forEach(blue=>{
                    this.blueSkiSlopeRegistry.set(blue.id,blue);
                })
                this.numberOfBlueSSlopes = blue.length;
            })
        } catch (error){
            console.log(error)
        }
    }

    loadBlackSSlope = async (id:string) =>{
        try{
            const black : SkiSlope[] = await agent.skiSlope.list(id,'crna');
            runInAction(()=>{
                black.forEach(black=>{
                    this.blackSkiSlopeRegistry.set(black.id,black);
                })
                this.numberOfBlackSSlopes = black.length;
            })
        } catch (error){
            console.log(error)
        }
    }

    loadGreenSSlope = async (id:string) =>{
        try{
            const green : SkiSlope[] = await agent.skiSlope.list(id,'zelena');
            runInAction(()=>{
                green.forEach(green=>{
                    this.greenSkiSlopeRegistry.set(green.id,green);
                })
                this.numberOfGreenSSlopes = green.length;
            })
        } catch (error){
            console.log(error)
        }
    }

    loadAllSkiSlopes = async (id:string) =>{
        try {
            await Promise.all([
              this.loadRedSSlope(id),
              this.loadblueSSlope(id),
              this.loadBlackSSlope(id),
              this.loadGreenSSlope(id),
            ]);
            console.log("All ski slopes loaded successfully");
          } catch (error) {
            console.log("Error loading all ski slopes:", error);
          }
    }

    get getBlackSkiSlopes(){
        return Array.from(this.blackSkiSlopeRegistry.values());
    }

    get getGreenSkiSlopes(){
        return Array.from(this.greenSkiSlopeRegistry.values());
    }

    get getBlueSkiSlopes(){
        return Array.from(this.blueSkiSlopeRegistry.values());
    }

    get getRedSkiSlopes(){
        return Array.from(this.redSkiSlopeRegistry.values());
    }
}