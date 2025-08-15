export  type User ={
  id: string;
  ime: string;
  prezime: string;
  telefon: string;
  email: string;
  username: string;
  uloga: string;
}

export type LogedUser ={
  id: string;
  username: string;
  uloga: string;
  email: string;
} 

export type Token = {
  nameid: string;
  unique_name: string;
  role: string;
  email: string;
}

export type AuthUser = {
  token:string
}

export type VisitOption = {
  korisnikID: string | undefined;
  skijalisteID: string | undefined;
  hotelID: string | undefined;
  restoranID: string | undefined;
}