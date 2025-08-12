import { toast } from "react-toastify";
import agent from "../api/agent";
import { AuthUser, LogedUser, TokenJebeni, User, VisitOption } from "../modules/User";
import { UserLoginForm } from "../modules/UserLoginForm";
import { jwtDecode } from "jwt-decode";
import { makeAutoObservable, runInAction } from "mobx";
import { VacationOptions } from "../modules/VacationOptions";
import { Recommendation } from "../modules/Recommendations";

export default class UserStore {
    curentUser : LogedUser | undefined= undefined; 
    recommendations = new Map<string,Recommendation>();

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

    visitOption = async (option: VacationOptions) =>{
        try{
            const visit: VisitOption = {
                hotelID: option.hotel.id,
                korisnikID: this.curentUser?.id,
                restoranID: option.restoran.id,
                skijalisteID: option.skijaliste.id
            };
            await agent.user.visitOption(visit);
        }
        catch(err){
            toast.error("Doslo je do greske")
        }
    }
    

    listRecommendations = async () => {
    try {
        const recommendations = await agent.user.listRecommendations(this.curentUser!.id);
        if(this.recommendations.size!=0)
            this.recommendations.clear();
        runInAction(() => {
            recommendations.forEach((recom) => {
                this.recommendations.set(recom.id, {
                    ...recom,
                    hoteli: Array.isArray(recom.hoteli) ? recom.hoteli : [],
                    restorani: Array.isArray(recom.restorani) ? recom.restorani : []
                });
            });
        });
    } catch (err) {
        console.error(err);
    }
}

    get getRecommendations(){
      return Array.from(this.recommendations.values());
    }
}