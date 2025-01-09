import { createContext, useContext } from "react";
import HotelStore from "./hotelStore";
import skiResortStore from "./skiResortStore";
import SkiResortStore from "./skiResortStore";

interface Store{
    hotelStore:HotelStore,
    skiResortStore : SkiResortStore
}

export const store: Store ={
    hotelStore : new HotelStore(),
    skiResortStore : new SkiResortStore()
}

export const StoreContext = createContext(store);

export function useStore(){
    return useContext(StoreContext);
}