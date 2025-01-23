import axios, { AxiosError, AxiosResponse } from "axios";
import  {Hotel}  from '../modules/Hotel';
import { SkiResort } from "../modules/SkiResort";
import { Restaurant } from "../modules/Restaurant";
import { SkiSlope } from "../modules/SkiSlope";

const sleep =(delay: number) =>{
    return new Promise((resolve)=>{
        setTimeout(resolve,delay)
    })
}

//axios.defaults.baseURL='http://localhost:5000/api';
axios.defaults.baseURL='http://localhost:5000/api';



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
    create : (hotel:Hotel) => requests.post<void>('Hotel', hotel)
}

const skiResort = {
    list : () => requests.get<SkiResort[]>('Skijaliste/VratiSvaSkijalista'),
    create : (skiResort:SkiResort) => requests.post<void>('Skijaliste', skiResort)
}

const restaurant = {
    list : (id:string) => requests.get<Restaurant[]>(`Restoran/Skijaliste/${id}/Restorani`),
    create : (restaurant:Restaurant) => requests.post<void>('Restoran', restaurant)
}

const skiSlope = {
    list : (id:string, color : string) => requests.get<SkiSlope[]>(`Staza/VratiStazePoTezini/${id}/${color}`),
    create : (skiSlope : SkiSlope) => requests.post<void>('Staza/Kreiraj',skiSlope)
}

const agent = {
    hotel,
    skiResort,
    restaurant,
    skiSlope
}

export default agent