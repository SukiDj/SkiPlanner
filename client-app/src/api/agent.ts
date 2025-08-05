import axios, { AxiosResponse } from "axios";
import  {Hotel}  from '../modules/Hotel';
import { SkiResort } from "../modules/SkiResort";
import { Restaurant } from "../modules/Restaurant";
import { SkiSlope } from "../modules/SkiSlope";



//axios.defaults.baseURL='http://localhost:5001/api';
axios.defaults.baseURL='https://localhost:5001/api';





const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url:string) => axios.get<T>(url).then(responseBody),
    post: <T>(url:string, body:{}) => axios.post<T>(url, body).then(responseBody),
    postFormData: <T>(url: string, formData: FormData) => axios.post<T>(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(responseBody),
    put: <T>(url:string,body:{}) => axios.put<T>(url,body).then(responseBody),
    del: <T>(url:string)=> axios.delete<T>(url).then(responseBody)
}

const hotel = {
    listHotelsForResort : (id : string)=> requests.get<Hotel[]>(`Hotel/Skijaliste/${id}/Hoteli`),
    create : (id:string,hotel:Hotel) => requests.post<void>(`Hotel/KreirajHotelNaSkijalistu/${id}`, hotel),
    update : (id: string, hotel:Hotel) => requests.put<void>(`Hotel/${id}`,hotel),
    delete : (id:string) => requests.del<void>(`Hotel/${id}`)
}

const skiResort = {
    list : () => requests.get<SkiResort[]>('Skijaliste/VratiSvaSkijalista'),
    create : (skiResort:SkiResort) => requests.post<void>('Skijaliste', skiResort),
    update : (id: string, skiResort: SkiResort) => requests.put<void>(`Skijaliste/${id}`, skiResort),
    delete : (id:string) => requests.del<void>(`Skijaliste/${id}`)
}

const restaurant = {
    list : (id:string) => requests.get<Restaurant[]>(`Restoran/Skijaliste/${id}/Restorani`),
    create : (id:string, restaurant:Restaurant) => requests.post<void>(`Restoran/KreirajRestoranNaSkijalistu/${id}`, restaurant),
    update : (id:string, restaurant: Restaurant) => requests.put<void>(`Restoran/${id}`,restaurant),
    delete : (id:string) => requests.del<void>(`Restoran/${id}`)
}


const skiSlope = {
    list : (id:string, color : string) => requests.get<SkiSlope[]>(`Staza/VratiStazePoTezini/${id}/${color}`),
    create : (id:string, skiSlope : SkiSlope) => requests.post<void>(`Staza/KreirajNaSkijalistu/${id}`,skiSlope),
    update : (id:string, skiSlope: SkiSlope) => requests.put<void>(`Staza/Izmeni/${id}`,skiSlope),
    delete : (id:string) => requests.del<void>(`Staza/Obrisi/${id}`)
}


const agent = {
    hotel,
    skiResort,
    restaurant,
    skiSlope
}

export default agent