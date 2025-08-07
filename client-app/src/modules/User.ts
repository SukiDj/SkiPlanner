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

export type TokenJebeni = {
  nameid: string;
  unique_name: string;
  uloga: string;
  email: string;
}

export type AuthUser = {
  token:string
}