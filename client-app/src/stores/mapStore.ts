import { makeAutoObservable } from "mobx";

export default class MapStore {
    isCreating : boolean = false;

    constructor(){
        makeAutoObservable(this);
    }

    setIsCreating = (value:boolean) =>{
        this.isCreating = value;
    }
}