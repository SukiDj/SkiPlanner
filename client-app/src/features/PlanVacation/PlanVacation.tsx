
import { observer } from "mobx-react-lite";
import VacationForm from "../CreatePage/Forms/VacationForm";
import Vacations from "./Vacations";

const PlanVacation = () =>{


    return(
    <>
    <VacationForm />
    <Vacations />
    </>
    )
}
export default observer(PlanVacation);