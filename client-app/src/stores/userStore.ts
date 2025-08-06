import { toast } from "react-toastify";
import agent from "../api/agent";
import { User } from "../modules/User";

export default class UserStore {
    curentUser : User | undefined= undefined; 

    registerUser = async (data: User) =>{
        try{
            await agent.user.register(data)
            toast.success("Uspešno ste se registrovali!")
        }
        catch(error){
            toast.error("Greška prilikom registracije!")
        }
    }
}