import { makeAutoObservable } from 'mobx';
import { Hotel } from '../modules/Hotel';

export default class HotelStore {
  hotels : Hotel[]= []
  selectedHotel : Hotel | undefined = undefined

  constructor() {
    makeAutoObservable(this)
  }

  setSelectedHotel = (hotel:Hotel) => {
    this.selectedHotel = hotel
    console.log(this.selectedHotel);
    
  }

  setAllHotels = (hotels:Hotel[]) =>{
    this.hotels = hotels
  }
}
