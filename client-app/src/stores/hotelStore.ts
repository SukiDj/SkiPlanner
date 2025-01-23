import { makeAutoObservable } from 'mobx';
import { Hotel } from '../modules/Hotel';
import agent from '../api/agent';

export default class HotelStore {

  hotelRegistry = new Map<string,Hotel>();
  selectedHotel : Hotel | undefined = undefined;


  constructor() {
    makeAutoObservable(this);
  }



  createHotel = async (hotel:Hotel) =>{
    try{
      await agent.hotel.create(hotel);

    } catch (error)
    {
      console.log(error);
    }
  }

  setSelectedHotel = (hotel:Hotel) => {
    this.selectedHotel = hotel
  }

  setAllHotels = (hotel:Hotel) =>{
    this.hotelRegistry.set(hotel.id!,hotel);
    
  }

  get getHotels(){
    return Array.from(this.hotelRegistry.values());
  }

  loadHotelsForResort = async (id : string) =>{
    try{
      this.hotelRegistry = new Map<string,Hotel>();
      const hotels: Hotel[] = await agent.hotel.listHotelsForResort(id);
      console.log(hotels)
      hotels.forEach(hotel=>{
        this.setAllHotels(hotel);
      });
      console.log(this.getHotels)
    }
    catch(error){
      console.log(error)
    }
  }
}
