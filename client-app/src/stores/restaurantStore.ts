import { makeAutoObservable } from "mobx";
import { Restaurant } from "../modules/Restaurant";
import agent from "../api/agent";

export default class RestaurantStore {
    restaurantRegistry = new Map<string,Restaurant>();
    selectedRestaurant : Restaurant | undefined = undefined;

    constructor(){
        makeAutoObservable(this);
    }

    createRestaurant = async (id:string,restaurant:Restaurant) =>{
        try{
            await agent.restaurant.create(id,restaurant);
        } catch (error) {
            console.log(error);
        }
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