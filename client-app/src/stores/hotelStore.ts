import { makeAutoObservable } from 'mobx';
import { Hotel } from '../modules/Hotel';
import agent from '../api/agent';

export default class HotelStore {

  hotelRegistry = new Map<string,Hotel>();
  selectedHotel : Hotel | undefined = undefined;
  editStarted : boolean = false;


  constructor() {
    makeAutoObservable(this);
  }

  setEditStarted = (value : boolean) => this.editStarted = value; 

  createHotel = async (id:string, hotel:Hotel) =>{
    try{
      await agent.hotel.create(id,hotel);
      

    } catch (error)
    {
      console.log(error);
    }
  }

  setSelectedHotelLatLng = (lat: number, lng: number) =>{
    this.selectedHotel!.lat = lat;
    this.selectedHotel!.lng = lng;
  }

  updateHotel = async (id:string, hotel:Hotel) =>{
    try{
      await agent.hotel.update(id,hotel);
      this.hotelRegistry.set(id, hotel);
      if (this.selectedHotel?.id === id) {
        this.selectedHotel = hotel;
      }
    } catch (error)
    {
      console.log(error);
    }
    this.setEditStarted(false);
  }

  deleteHotel = async (id:string) =>{
    try{
      await agent.hotel.delete(id);
      this.hotelRegistry.delete(id);
      if(this.selectedHotel?.id === id)
        this.setSelectedHotel(undefined);
    }catch(err){
      console.log(err)
    }
  }

  setSelectedHotel = (hotel:Hotel | undefined) => {
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
