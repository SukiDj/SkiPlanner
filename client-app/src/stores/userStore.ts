import { toast } from "react-toastify";
import agent from "../api/agent";
import { AuthUser, LogedUser, TokenJebeni, User } from "../modules/User";
import { UserLoginForm } from "../modules/UserLoginForm";
import { jwtDecode } from "jwt-decode";
import { makeAutoObservable } from "mobx";

export default class UserStore {
    curentUser : LogedUser | undefined= undefined; 

    constructor(){
        makeAutoObservable(this);
    }

    registerUser = async (data: User) =>{
        try{
            await agent.user.register(data)
            toast.success("Uspešno ste se registrovali!")
        }
        catch(error){
            toast.error("Greška prilikom registracije!")
        }
    }

    loginUser = async (params: UserLoginForm) =>{
        try{
            const answer: AuthUser =  await agent.user.login(params);
            if(answer)
            {
                const decoded = jwtDecode<TokenJebeni>(answer.token);
                this.curentUser = {
                    id: decoded.nameid,
                    email: decoded.email,
                    uloga: decoded.uloga,
                    username: decoded.unique_name
                }
            }
        } catch(error){
            toast.error("Greška prilikom prijave!")
        }
    }

    logout = () =>{

    }
}