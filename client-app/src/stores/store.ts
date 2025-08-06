import { createContext, useContext } from "react";
import HotelStore from "./hotelStore";
import skiResortStore from "./skiResortStore";
import SkiResortStore from "./skiResortStore";
import RestaurantStore from "./restaurantStore";
import SkiSlopeStore from "./skiSlopeStore";
import MapStore from "./mapStore";
import VacationStore from "./vacationStore";
import UserStore from "./userStore";

interface Store{
    hotelStore:HotelStore,
    skiResortStore : SkiResortStore,
    restaurantStore : RestaurantStore,
    skiSlopeStore : SkiSlopeStore,
    mapStore : MapStore,
    vacationStore : VacationStore,
    userStore: UserStore
}

export const store: Store ={
    hotelStore : new HotelStore(),
    skiResortStore : new SkiResortStore(),
    restaurantStore : new RestaurantStore(),
    skiSlopeStore : new SkiSlopeStore(),
    mapStore : new MapStore(),
    vacationStore : new VacationStore(),
    userStore : new UserStore()
}

export const StoreContext = createContext(store);

export function useStore(){
    return useContext(StoreContext);
}