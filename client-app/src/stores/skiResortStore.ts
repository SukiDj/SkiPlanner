import React from 'react'
import HotelStore from './hotelStore';
import { store } from './store';

export default class SkiResortStore {
 
    resorts =  [
        {
          name: "Kopaonik",
          hotels: [
            { name: "Hotel A", description: "A luxurious hotel with spa and pool.", lat:43.284695, lng: 20.808437 },
            { name: "Hotel B", description: "Affordable hotel near the ski slopes.", lat:43.284695, lng: 20.808437 },
            { name: "Hotel C", description: "Cozy mountain retreat with beautiful views.", lat:43.284695, lng: 20.808437 },
          ],
        },
        {
          name: "Zlatibor",
          hotels: [
            { name: "Hotel D", description: "Relaxing hotel in the heart of nature.", lat:43.284695, lng: 20.808437 },
            { name: "Hotel E", description: "Family-friendly hotel near attractions.", lat:43.284695, lng: 20.808437 },
          ],
        },
      ];

    selectedResort : any | undefined = undefined
    hotels : any = undefined

    setSelectedResort = (resort:any) => {
        this.selectedResort = resort
        store.hotelStore.hotels = resort.hotels
        console.log(store.hotelStore.hotels) 
    }
}
