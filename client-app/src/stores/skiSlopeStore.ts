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
    color : string[] = [ "plava", "crvena", "zelena", "crna"];
    selectedSlope: SkiSlope | undefined = undefined;
    editMode : boolean = false;

    constructor(){
        makeAutoObservable(this);
    }


    setSelectedSlope = (slope: SkiSlope | undefined) => {
    this.selectedSlope = slope;
    }


    openForm = () => {
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }

    create = async (id:string, skiSlope: SkiSlope) =>{
        try{
            await agent.skiSlope.create(id,skiSlope);

        } catch(error){
            console.log(error);
        }
    }

    update = async (id: string, skiSlope: SkiSlope) => {
  try {
    await agent.skiSlope.update(id, skiSlope);

    let foundKey: string | undefined;
    let foundRegistry: Map<string, SkiSlope> | undefined;

    const registries = [
      { map: this.redSkiSlopeRegistry, color: "crvena" },
      { map: this.blueSkiSlopeRegistry, color: "plava" },
      { map: this.greenSkiSlopeRegistry, color: "zelena" },
      { map: this.blackSkiSlopeRegistry, color: "crna" }
    ];

    for (const reg of registries) {
      if (reg.map.has(id)) {
        foundKey = id;
        foundRegistry = reg.map;
        break;
      }
    }

    if (foundRegistry && foundKey) {
      const oldSlope = foundRegistry.get(foundKey)!;

      if (oldSlope.tezina !== skiSlope.tezina) {
        foundRegistry.delete(foundKey);

        const newRegistry = registries.find(r => r.color === skiSlope.tezina)?.map;
        if (newRegistry) {
          newRegistry.set(id, skiSlope);
        }
      } else {
        foundRegistry.set(id, skiSlope);
      }
    } else {
      const newRegistry = registries.find(r => r.color === skiSlope.tezina)?.map;
      if (newRegistry) {
        newRegistry.set(id, skiSlope);
      }
    }

    runInAction(() => {
      this.numberOfRedSSlopes = this.redSkiSlopeRegistry.size;
      this.numberOfBlueSSlopes = this.blueSkiSlopeRegistry.size;
      this.numberOfGreenSSlopes = this.greenSkiSlopeRegistry.size;
      this.numberOfBlackSSlopes = this.blackSkiSlopeRegistry.size;
    });

    this.setSelectedSlope(undefined);

  } catch (error) {
    console.log(error);
  }
};

    deleteSkiSlope = async (skiSlope: SkiSlope) =>{
    try{
      await agent.skiSlope.delete(skiSlope.id);
      switch(skiSlope.tezina){
        case "crvena":
            this.redSkiSlopeRegistry.delete(skiSlope.id);
            this.numberOfRedSSlopes -= 1;
            break;
        case "plava":
            this.blueSkiSlopeRegistry.delete(skiSlope.id);
            this.numberOfBlueSSlopes -= 1;
            break;
        case "zelena":
            this.greenSkiSlopeRegistry.delete(skiSlope.id);
            this.numberOfGreenSSlopes -= 1;
            break;
        case "crna":
            this.blackSkiSlopeRegistry.delete(skiSlope.id);
            this.numberOfBlackSSlopes -= 1;
            break;
      }
    }catch(err){
      console.log(err)
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
            if(this.redSkiSlopeRegistry.size !== 0)
              this.redSkiSlopeRegistry.clear();
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