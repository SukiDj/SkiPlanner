import { makeAutoObservable } from "mobx";
import { Restaurant } from "../modules/Restaurant";
import agent from "../api/agent";
import { toast } from "react-toastify";

export default class RestaurantStore {
    restaurantRegistry = new Map<string,Restaurant>();
    selectedRestaurant : Restaurant | undefined = undefined;
    restaurantEditStarted : boolean = false;

    constructor(){
        makeAutoObservable(this);
    }

    createRestaurant = async (id:string,restaurant:Restaurant) =>{
        try{
            await agent.restaurant.create(id,restaurant);
            toast.success("Uspesno kreiranje restorana!");
        } catch (error) {
            console.log(error);
        }
    }

    setRestaurantEditStarted = (value : boolean) => this.restaurantEditStarted = value;

    updateRestaurant = async (id:string, restaurant:Restaurant) =>{
    try{
      await agent.restaurant.update(id,restaurant);
      this.restaurantRegistry.set(id, restaurant);
      if (this.selectedRestaurant?.id === id) {
        this.selectedRestaurant = restaurant;
      }
      toast.success("Uspesna izmena restorana!");
    } catch (error)
    {
      console.log(error);
    }
    this.setRestaurantEditStarted(false);
  }

  deleteRestaurant = async (id:string) =>{
    try{
      await agent.restaurant.delete(id);
      this.restaurantRegistry.delete(id);
      if(this.selectedRestaurant?.id === id)
        this.setSelectedRestaurant(undefined);
      toast.success("Uspesno brisanje restorana!");
    }catch(err){
      console.log(err)
    }
  }

  setSelectedRestaurantLatLng = (lat: number, lng: number) =>{
    this.selectedRestaurant!.lat = lat;
    this.selectedRestaurant!.lng = lng;
  }
    setRestaurant = (restaurant: Restaurant) =>{
        this.restaurantRegistry.set(restaurant.id!,restaurant);
    }

    setSelectedRestaurant = (restaurant: Restaurant | undefined) =>{
        this.selectedRestaurant = restaurant;
    }

    get getRestaurants(){
        return Array.from(this.restaurantRegistry.values());
    }

    loadRestaurants = async (id:string) =>{
        try{
            this.restaurantRegistry = new Map<string,Restaurant>();
            const restaurants : Restaurant[] = await agent.restaurant.list(id);
            restaurants.forEach(restaurant=>{
                this.setRestaurant(restaurant);
            })
        } catch(error)
        {
            console.log(error);
        }
    } 
}