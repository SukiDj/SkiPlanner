/* eslint-disable @typescript-eslint/no-unused-vars */
import { toast } from "react-toastify";
import agent from "../api/agent";
import { AuthUser, LogedUser, Token, User, VisitOption } from "../modules/User";
import { UserLoginForm } from "../modules/UserLoginForm";
import { jwtDecode } from "jwt-decode";
import { makeAutoObservable, runInAction } from "mobx";
import { VacationOptions } from "../modules/VacationOptions";
import { Recommendation } from "../modules/Recommendations";
import axios from "axios";
import { websocketService } from "../services/websocketService";

export default class UserStore {
    curentUser : LogedUser | undefined= undefined; 
    recommendations = new Map<string,Recommendation>();
    loadingRegLog: boolean = false;

    constructor(){
        makeAutoObservable(this);

        const token = localStorage.getItem("jwt");
        if (token) {
            const decoded = jwtDecode<Token>(token);
            this.curentUser = {
                id: decoded.nameid,
                email: decoded.email,
                uloga: decoded.role,
                username: decoded.unique_name
            };
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
    }

    get isVisitor(){
        return this.curentUser?.uloga === "Posetilac";
    }

    get isEmploye(){
        return this.curentUser?.uloga === "RadnikNaSkijalistu";
    }

    setLoadingRegLog = (val : boolean) => this.loadingRegLog = val;


    registerUser = async (data: User) =>{
        this.setLoadingRegLog(true);
        try{
            await agent.user.register(data)
            toast.success("Uspešno ste se registrovali!")
        }
        catch(error){
            toast.error("Greška prilikom registracije!")
        }
        this.setLoadingRegLog(false);
    }

    loginUser = async (params: UserLoginForm) =>{
        this.setLoadingRegLog(true);
        try{
            const answer: AuthUser =  await agent.user.login(params);
            if(answer)
            {

                const decoded = jwtDecode<Token>(answer.token);
                console.log(decoded)
                this.curentUser = {
                    id: decoded.nameid,
                    email: decoded.email,
                    uloga: decoded.role,
                    username: decoded.unique_name
                };

                // Sačuvaj token u localStorage i postavi header
                localStorage.setItem("jwt", answer.token);
                axios.defaults.headers.common["Authorization"] = `Bearer ${answer.token}`;
                
                toast.success("Uspešno ste se prijavili!")
            }
        } catch(error){
            toast.error("Greška prilikom prijave!")
        }
        this.setLoadingRegLog(false);
    }

    logout = () =>{
        localStorage.removeItem("jwt");
        delete axios.defaults.headers.common["Authorization"];
        this.curentUser = undefined;
        
        websocketService.disconnect();
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
      this.recommendations.clear();

      recommendations.forEach((recom: any) => {
        const ski = recom.skijaliste;
        if (ski && ski.id) {
          const formatted: Recommendation = {
            id: ski.id,                
            skijaliste: ski,
            hoteli: Array.isArray(recom.hoteli) ? recom.hoteli : [],
            restorani: Array.isArray(recom.restorani) ? recom.restorani : []
          };

          this.recommendations.set(ski.id, formatted);
        }
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